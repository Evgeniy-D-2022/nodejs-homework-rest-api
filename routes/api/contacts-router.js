import express from "express";
import contactController from "../../controllers/contact-controller.js";
import {isEmptyBody} from '../../middlewares/index.js';
import {validateBody} from '../../decorators/index.js';
import {contactAddSchema} from '../../schemas/contact-schemas.js';

const contactAddValidate = validateBody(contactAddSchema)
const contactsRouter = express.Router()

contactsRouter.get('/', contactController.getAll)

contactsRouter.get('/:id', contactController.getById)

contactsRouter.post('/', isEmptyBody, contactAddValidate, contactController.add)

contactsRouter.put('/:id', isEmptyBody, contactAddValidate, contactController.updateById)

contactsRouter.delete('/:id', contactController.deleteById)

export default contactsRouter;