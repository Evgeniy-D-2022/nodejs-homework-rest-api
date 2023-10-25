import express from "express";
import authController from "../../controllers/auth-controller.js";
import {isEmptyBody} from '../../middlewares/index.js';
import {validateBody} from '../../decorators/index.js';
import { userSigninSchema, userSignupSchema } from "../../models/user.js";

const userSignupValidate = validateBody(userSignupSchema);

const authRouter = express.Router();

authRouter.post("/signup", isEmptyBody, userSignupValidate, authController.signup);

export default authRouter;