import Joi from "joi";

export const networkBody = Joi.object({
    title: Joi.string().required(),
    network: Joi.string().required(),
    password: Joi.string().required(),
})