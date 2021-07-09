import {Base} from './../base/base'
import {ACCOUNT_TYPE, ACCOUNT_TYPE_COUNTER, ACCOUNT_TYPE_KEY_PREFIX} from './../constants/index'
import {Account} from './../interfaces/index'

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
        const suffix = `${account.title.split(' ').join()}::${account.bank}`
        const result = await super.create(account, suffix)
        result['key'] = this.getKeyPrefix() + suffix
        return Promise.resolve(result)
    }
}

export const AccountsManager = new Accounts()