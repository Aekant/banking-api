import {Request, Response, Router} from 'express'
import {Account, TransferHistory, User} from '../interfaces'
import {AccountsManager, UsersManager} from './../moduleloader'
import {accountCreate, accountListingQueryParameter, accountLogsQueryParameters, paymentSchema} from './../schemas/index'
import {validateQueryParameters, validateSchema} from './../utils/schemaValidation'

export const accountRouter = Router()

accountRouter
    .route('/')
    .post(validateSchema(accountCreate), async (req: Request, res: Response) => {
        try {
            // find if the user for which we are creating an account exists?
            const user = await UsersManager.findById(req.body['identityNo']) as User
            // if user is found then create an account
            const account = await AccountsManager.createAccount(req.body as Account)
            // put the refernce of the account object in the user's object
            user.accounts.push(account['key'])
            await UsersManager.replace(user, `${user.identityNo}`)

            delete account['key']
            res.status(201).send({data: account})
        } catch (err: any) {
            res.status(400).send({error: err.message})
        }
    })

accountRouter
    .route('/payments')
    .post(validateSchema(paymentSchema), async (req: Request, res: Response) => {
        try {
            let beneficiary: Account = req.body['beneficiary']
            let benefactor: Account = req.body['benefactor']

            beneficiary =  await AccountsManager.findValueByKey(AccountsManager.getKey(`${beneficiary.title.split(' ').join()}::${beneficiary.bank}`))
            benefactor =  await AccountsManager.findValueByKey(AccountsManager.getKey(`${benefactor.title.split(' ').join()}::${benefactor.bank}`))

            if(benefactor.balance - (+req.body['amount']) < 500)
                throw new Error('Benefactor account balance cannot be less than 500')

            await AccountsManager.payment(benefactor, beneficiary, +req.body.amount)
            res.status(201).send({message: "Payment successful"})
        } catch (err) {
            res.status(400).send({error: err.message})
        }
    })

accountRouter
    .route('/logs')
    .get(validateQueryParameters(accountLogsQueryParameters), async (req: Request, res: Response) => {
        try {
            const logs: Array<TransferHistory> = await AccountsManager.getLogs(req.query as {title:string, bank: string})
            res.status(200).send({data: logs})
        } catch(err: any) {
            res.status(400).send({error: err.message})
        }
    })

accountRouter
    .route('/:id')
    .get(validateQueryParameters(accountListingQueryParameter), async (req: Request, res: Response) => {
        try {
            const filter = req.query as {title: string, bank: string}
            const result = await AccountsManager.getAccounts(+req.params.id, filter)

            res.status(200).send({result})
        } catch (err: any) {
            res.status(400).send({error: err.message})
        }
    })