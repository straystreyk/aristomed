import {validationResult} from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

import {Role} from "../models/Role.js";
import {User} from "../models/User.js";

dotenv.config()

export const registration = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({message: "Ошибки при регестрации", ...errors})
        }
        const {login, password} = req.body
        const candidate = await User.findOne({login})
        if (candidate) {
            return res.status(400).json({message: "Такой пользователь уже существует"})
        }
        const hashPassword = await bcrypt.hashSync(password, 7)
        const user_role = await Role.findOne({value: "USER"})
        const user = new User({login, password: hashPassword, roles: [user_role.value]})
        await user.save()
        return res.json({message: "Спасибо за регистрацию!"})
    } catch (e) {
        console.log(e)
        return res.json({message: "Произошла ошибка...."})
    }
}

export const login = async (req, res) => {
    try {
        const {login, password} = req.body
        const user = await User.findOne({login})
        if (!user) {
            return res.status(400).json({message: `Пользователь ${login} не найден`})
        }
        const valid_password = bcrypt.compareSync(password, user.password)
        if (!valid_password) {
            return res.status(400).json({message: "Неправильный пароль"})
        }
        const token = generate_access_token(user.id, user.roles, user.name)
        return res.json({token})
    } catch (e) {
        console.log(e)
        return res.json({message: "login error"})
    }
}

const generate_access_token = (id, roles, name) => {
    const payload = {
        id,
        roles,
        name
    }
    return jwt.sign(payload, process.env.SECRET_JWT, {expiresIn: "24h"})
}

