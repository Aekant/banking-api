import joi, {ObjectSchema} from 'joi'

export const userCreate: ObjectSchema = joi.object().keys({
    name: joi.string().required(),
    balance: joi.number().min(500).required()
})
