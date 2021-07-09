import {Request, Response, Router} from 'express'
import {Account, User} from '../interfaces'
import {AccountsManager, UsersManager} from './../moduleloader'
import {accountCreate} from './../schemas/index'
import {validateSchema} from './../utils/schemaValidation'

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