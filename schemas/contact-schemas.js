import Joi from "joi"

export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
      message: `missing required "name" field`
    }),
    email: Joi.string().required().messages({
      message: `missing required "email" field`
    }),
    phone: Joi.string().required().messages({
      message: `missing required "phone" field`
    })
  })
