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
            if (!user)
                throw new Error('User with the given identity number does not exists')

            const account = await AccountsManager.createAccount(req.body as Account)
            res.status(201).send({data: account})
        } catch (err: any) {
            res.status(400).send({error: err.message})
        }
    })