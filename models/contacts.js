import { Schema, model } from "mongoose";
import Joi from "joi";
import {handleMongooseError} from '../helpers/index.js';
import {runValidatorsAtUpdate} from '../helpers/index.js';

const contactsSchema = new Schema({
        name: {
          type: String,
          required: [true, 'Set name for contact'],
        },
        email: {
          type: String,
        },
        phone: {
          type: String,
          required: true,
        },
        favorite: {
          type: Boolean,
          default: false,
        },
      }, {versionKey: false, timestamps: true}
)

contactsSchema.post('save', handleMongooseError);
contactsSchema.pre('findOneAndUpdate', runValidatorsAtUpdate);
contactsSchema.post('findOneAndUpdate', handleMongooseError);

export const contactAddSchema = Joi.object({
      name: Joi.string().required().messages({
        "any.required": `missing required "name" field`
      }),
      email: Joi.string().required().messages({
        "any.required": `missing required "email" field`
    }),
      phone: Joi.string().required().messages({
        "any.required": `missing required "phone" field`
    }),
    favorite: Joi.boolean(), 
  });

export const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const Contact = model('contact', contactsSchema);

export default Contact;
