import express from "express";
import authController from "../../controllers/auth-controller.js";
import {authenticate, isEmptyBody} from '../../middlewares/index.js';
import {validateBody} from '../../decorators/index.js';
import { loginSchema, registerSchema } from "../../models/user.js";

const registerValidate = validateBody(registerSchema);
const loginValidate = validateBody(loginSchema);

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, registerValidate, authController.register);
authRouter.post("/login", isEmptyBody, loginValidate, authController.login);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;