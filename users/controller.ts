import {Request, Response, Router} from 'express'
import {User} from '../interfaces'
import {UsersManager} from './../moduleloader'
import {userCreate} from './../schemas/index'
import {validateSchema} from './../utils/schemaValidation'

export const userRouter = Router()

userRouter
    .route('/')
    .post(validateSchema(userCreate), async (req: Request, res: Response) => {
        try {
            const user = await UsersManager.createUser(req.body as User)
            res.status(201).send({data: user})
        } catch (err: any) {
            res.status(400).send({error: err.message})
        }
    })