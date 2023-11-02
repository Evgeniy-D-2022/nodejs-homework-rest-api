import express from "express";
import authController from "../../controllers/auth-controller.js";
import {authenticate, isEmptyBody, upload} from '../../middlewares/index.js';
import {validateBody} from '../../decorators/index.js';
import { emailSchema, loginSchema, registerSchema } from "../../models/user.js";

const registerValidate = validateBody(registerSchema);
const loginValidate = validateBody(loginSchema);
const emailValidate = validateBody(emailSchema);

const authRouter = express.Router();

authRouter.post("/register", isEmptyBody, registerValidate, authController.register);
authRouter.get("/verify/:verificationToken", authController.verify);
authRouter.post("/verify", isEmptyBody, emailValidate, authController.resendValidateEmail);
authRouter.post("/login", isEmptyBody, loginValidate, authController.login);
authRouter.get("/current", authenticate, authController.getCurrent);
authRouter.post("/logout", authenticate, authController.logout);
authRouter.patch("/avatars", authenticate, upload.single("avatar"), authController.updateAvatar);

export default authRouter;