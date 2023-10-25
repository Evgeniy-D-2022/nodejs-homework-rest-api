import User from "../models/user.js";

import {HttpError} from "../helpers/index.js";
import {ctrlWrapper} from "../decorators/index.js";

const signup = async(req, res) => {
    const {email}= req.body;
    const user = await User.findOne({email});
        if(user) {
        throw HttpError(409, `${email} Email in use`)
    }
    const newUser = await User.create(req.body);

    res.status(201).json({
        username: user.username,
        email: user.email,
    })

}

export default {
    signup: ctrlWrapper(signup),

}