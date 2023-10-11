import express from "express";
import contactsService from "../../models/index.js";
import HttpError from "../../helpers/HttpError.js";
import Joi from "joi";

const contactsRouter = express.Router()

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "message": `missing required "name" field`
  }),
  email: Joi.string().required().messages({
    "message": `missing required "email" field`
  }),
  phone: Joi.string().required().messages({
    "message": `missing required "phone" field`
  })
})

contactsRouter.get('/', async(req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error)   
  }
})

contactsRouter.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const result = await contactsService.getContactById(id);
    if(!result) {
      throw HttpError(404, `Contact with id:'${id}' not found`)
    }
    res.json(result);
  } catch (error) {
    next(error)   
  }
})

contactsRouter.post('/', async (req, res, next) => {
  try {
    const {error} = contactAddSchema.validate(req.body);
    if(error) {
      throw HttpError(400, error.message)
    }
    // const result = await contactsService.addContact(req.body)
    // res.status(201).json(result)
    
  } catch (error) {
    next(error) 
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

export default contactsRouter;