import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {HttpError, sendEmail} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";
import gravatar from "gravatar";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { nanoid } from "nanoid";

const {JWT_SECRET, BASE_URL} = process.env;
const avatarsPath = path.resolve("public", "avatars");

const register = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
        if(user) {
        throw HttpError(409, 'Email in use')
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});    

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`,
    }
    await sendEmail(verifyEmail);

    res.status(201).json({
        // username: newUser.username,
        email: newUser.email,
    })
}

const verify = async(req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if(!user) {
        throw HttpError(404, 'User not found')
    } 
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: " " });
    res.status(200).json({ message: "Verification successful" });
}

const resendValidateEmail = async(req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(404, "Email not found")
    }
    if(user.verify) {
        throw HttpError(400, "Verification has already been passed")
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`,
    }
    await sendEmail(verifyEmail);

    res.status(200).json({
        message: "Verification email sent"
    })
}

const login = async(req, res) => {
    const {email, password}= req.body;
    const user = await User.findOne({email});
        if(!user) {
            throw HttpError(401, 'Email or password is wrong')
    }
        if(!user.verify) {
            throw HttpError(401, "Email not verify")
        }

    const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare) {
            throw HttpError(401, 'Email or password is wrong')
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "23h"});
    await User.findByIdAndUpdate(user._id, {token})

    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
 }

 const getCurrent = async(req, res) => {
    const { email, subscription } = req.user;
    console.log(req.body);

    res.json({
        email,
        subscription,
    })
 }

 const logout = async(req, res) => { 
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ''})

    res.status(204).json()
 }

 const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsPath, filename);
    await fs.rename(tempUpload, resultUpload);
    const image = await Jimp.read(resultUpload);
    image.cover(250, 250).write(resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({
        avatarURL,
    })
 }

export default {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendValidateEmail: ctrlWrapper(resendValidateEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}