import {NextFunction, Request, Response} from 'express'
import {ObjectSchema} from 'joi'

export const validateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body, {abortEarly: false})
            return next()
        } catch (err: any) {
            return res.status(400).send({error: err.message})
        }
    }
}

export const validateQueryParameters = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.query, {abortEarly: false})
            return next()
        } catch (err: any) {
            return res.status(400).send({error: err.message})
        }
    }
}
