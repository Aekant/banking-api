import {UsersManager} from '../users/manager'
import {Base} from './../base/base'
import {ACCOUNT_TYPE, ACCOUNT_TYPE_COUNTER, ACCOUNT_TYPE_KEY_PREFIX} from './../constants/index'
import {Account, TransferHistory, User} from './../interfaces/index'

class Accounts extends Base {
    getCounterKey() {
        return ACCOUNT_TYPE_COUNTER
    }

    getType() {
        return ACCOUNT_TYPE
    }

    getKeyPrefix() {
        return ACCOUNT_TYPE_KEY_PREFIX
    }

    async createAccount(account: Account): Promise<Account> {
        account.logs = []
        const suffix = `${account.title.split(' ').join()}::${account.bank}`
        const result = await super.create(account, suffix)
        result['key'] = this.getKeyPrefix() + suffix
        return Promise.resolve(result)
    }

    async payment(benefactor: Account, beneficiary: Account, amount: number) {
        benefactor.balance -= amount
        beneficiary.balance += amount

        const benefactorLog: TransferHistory = {
            type: 'Sent', 
            amount, 
            date: new Date(), 
            to: `${beneficiary.title}, ${beneficiary.bank}`
        }

        const beneficiaryLog: TransferHistory = {
            type: 'Recieved', 
            amount, 
            date: new Date(), 
            from: `${benefactor.title}, ${benefactor.bank}`
        }

        benefactor.logs.push(benefactorLog)
        beneficiary.logs.push(beneficiaryLog)

        await AccountsManager.replace(benefactor, `${benefactor.title.split(' ').join()}::${benefactor.bank}`)
        await AccountsManager.replace(beneficiary, `${beneficiary.title.split(' ').join()}::${beneficiary.bank}`)
    }

    async getAccounts(id: number, filter: {title: string, bank: string}) {
        const user = await UsersManager.findById(id) as User

        if(!filter.title) {
            let accountsPromiseArray: Array<Promise<Account>> = []

            for(let account of user.accounts) {
                
                accountsPromiseArray.push(AccountsManager.findValueByKey(account))
            }

            const accounts = await Promise.all(accountsPromiseArray)
            return Promise.resolve(accounts)
        } else {
            const account = await AccountsManager.findValueByKey(AccountsManager.getKey(`${filter.title}::${filter.bank}`))
            return Promise.resolve(account)
        }
    }

    async getLogs(filter: {title: string, bank: string}): Promise<Array<TransferHistory>> {
        const account = await AccountsManager.findValueByKey(AccountsManager.getKey(`${filter.title}::${filter.bank}`)) as Account
        return Promise.resolve(account.logs)
    }
}

export const AccountsManager = new Accounts()