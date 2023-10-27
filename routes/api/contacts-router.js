import express from "express";
import contactController from "../../controllers/contact-controller.js";
import {isEmptyBody, authenticate, isValidId} from '../../middlewares/index.js';
import {validateBody} from '../../decorators/index.js';
import {contactAddSchema, contactUpdateFavoriteSchema} from '../../models/contacts.js';

const contactAddValidate = validateBody(contactAddSchema)
const contactUpdateValidate = validateBody(contactUpdateFavoriteSchema)
const contactsRouter = express.Router()

contactsRouter.use(authenticate)

contactsRouter.get('/', contactController.getAll)

contactsRouter.get('/:id', isValidId, contactController.getById)

contactsRouter.post('/', isEmptyBody, contactAddValidate, contactController.add)

contactsRouter.put('/:id', isEmptyBody, isValidId, contactAddValidate, contactController.updateById)

contactsRouter.patch('/:id/favorite', isEmptyBody, isValidId, contactUpdateValidate, contactController.updateFavorite)

contactsRouter.delete('/:id', isValidId, contactController.deleteById)

export default contactsRouter;