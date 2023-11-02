import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {HttpError} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";
import gravatar from "gravatar";
import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";

const {JWT_SECRET} = process.env;
const avatarsPath = path.resolve("public", "avatars")

const register = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});
        if(user) {
        throw HttpError(409, 'Email in use')
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({...req.body, password: hashPassword, avatarURL});    

    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
    })
}

const login = async(req, res) => {
    const {email, password}= req.body;
    const user = await User.findOne({email});
        if(!user) {
            throw HttpError(401, 'Email or password is wrong')
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
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}