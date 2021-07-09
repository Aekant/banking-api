import joi, {ObjectSchema} from 'joi'

export const userCreate: ObjectSchema = joi.object().keys({
    name: joi.string().required(),
    identityNo: joi.number().required()
})

export const accountCreate: ObjectSchema = joi.object().keys({
    title: joi.string().required(),
    balance: joi.number().min(500).required(),
    bank: joi.string().required(),
    identityNo: joi.number().required()
})