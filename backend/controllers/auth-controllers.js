import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { Role } from "../models/Role.js";
import { User } from "../models/User.js";
import { Doctor } from "../models/Doctor.js";
import { Service } from "../models/Service.js";
import { MedicineDirection } from "../models/MedicineDirections.js";

dotenv.config();
const db = mongoose.connection;

export const registration = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Ошибки при регестрации", ...errors });
    }
    const { login, password } = req.body;
    const candidate = await User.findOne({ login });
    if (candidate) {
      return res
        .status(400)
        .json({ message: "Такой пользователь уже существует" });
    }
    const hashPassword = await bcrypt.hashSync(password, 7);
    const user_role = await Role.findOne({ value: "USER" });
    const user = new User({
      login,
      password: hashPassword,
      roles: [user_role.value],
    });
    await user.save();
    return res.json({ message: "Спасибо за регистрацию!" });
  } catch (e) {
    console.log(e);
    return res.json({ message: "Произошла ошибка...." });
  }
};

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login });
    if (!user) {
      return res
        .status(400)
        .json({ message: `Пользователь ${login} не найден` });
    }
    const valid_password = bcrypt.compareSync(password, user.password);
    if (!valid_password) {
      return res.status(400).json({ message: "Неправильный пароль" });
    }
    const token = generate_access_token(user.id, user.roles, user.name);
    return res.json({ token });
  } catch (e) {
    console.log(e);
    return res.json({ message: "login error" });
  }
};

const generate_access_token = (id, roles, name) => {
  const payload = {
    id,
    roles,
    name,
  };
  return jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: "24h" });
};

export const create_doctor = async (req, res) => {
  const { medicine_direction_ids, ...rest } = req.body;

  try {
    const doctor = new Doctor({
      medicine_direction_ids: medicine_direction_ids.map((el) =>
        mongoose.Types.ObjectId(el)
      ),
      ...rest,
    });
    await doctor.save();
    res.json({
      message: "Врач был успешно создан",
      redirect: "/admin/auth/doctors",
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const update_doctor = async (req, res) => {
  const { _id, medicine_direction_ids, ...rest } = req.body;

  try {
    await db.collection("doctors").updateOne(
      {
        _id: mongoose.Types.ObjectId(_id),
      },
      {
        $set: {
          medicine_direction_ids:
            medicine_direction_ids && medicine_direction_ids.length
              ? medicine_direction_ids.map((el) => mongoose.Types.ObjectId(el))
              : [],
          ...rest,
        },
      }
    );
    return res.json({
      message: "Врач был успешно обновлен",
      redirect: "/admin/auth/doctors",
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

export const delete_doctor = async (req, res) => {
  try {
    await db
      .collection("doctors")
      .deleteOne({ _id: mongoose.Types.ObjectId(req.body._id) });
    return res.json({
      message: "Врач был успешно удален",
      redirect: "/admin/auth/doctors",
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

export const create_medicine_direction = async (req, res) => {
  try {
    const medicine_direction = new MedicineDirection({
      ...req.body,
      reasons: req.body.reasons
        ? req.body.reasons.trim().split(",").filter(Boolean)
        : [],
    });
    await medicine_direction.save();
    return res.json({
      message: "Медецинское направление было успешно удален",
      redirect: "/admin/auth/medicine_directions",
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const update_medicine_direction = async (req, res) => {
  const { _id, reasons, ...rest } = req.body;

  try {
    await db.collection("medicine_directions").updateOne(
      { _id: mongoose.Types.ObjectId(_id) },
      {
        $set: {
          reasons: req.body.reasons
            ? req.body.reasons.trim().split(",").filter(Boolean)
            : [],
          ...rest,
        },
      }
    );
    return res.json({
      message: "Медецинское направление было успешно обновлен",
      redirect: "/admin/auth/medicine_directions",
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

export const delete_medicine_direction = async (req, res) => {
  try {
    await db
      .collection("medicine_directions")
      .deleteOne({ _id: mongoose.Types.ObjectId(req.body._id) });
    return res.json({
      message: "Медецинское направление было успешно удалено",
      redirect: "/admin/auth/medicine_directions",
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

export const create_services = async (req, res) => {
  try {
    const service = new Service({ ...req.body });
    await service.save();
    return res.json({
      message: "Медецинское услуга была успешно создана",
      redirect: "/admin/auth/services",
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const update_services = async (req, res) => {
  const { _id, medicineDirectionsIds, popularForDirectionsIds, ...rest } =
    req.body;

  try {
    await db.collection("services").updateOne(
      { _id: mongoose.Types.ObjectId(_id) },
      {
        $set: {
          medicineDirectionsIds:
            medicineDirectionsIds && medicineDirectionsIds.length
              ? medicineDirectionsIds.map((el) => mongoose.Types.ObjectId(el))
              : [],
          popularForDirectionsIds:
            popularForDirectionsIds && popularForDirectionsIds.length
              ? popularForDirectionsIds.map((el) => mongoose.Types.ObjectId(el))
              : [],
          ...rest,
        },
      }
    );
    return res.json({
      message: "Медицинская услуга была обновлена",
      redirect: "/admin/auth/services",
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};

export const delete_services = async (req, res) => {
  try {
    await db
      .collection("services")
      .deleteOne({ _id: mongoose.Types.ObjectId(req.body._id) });
    return res.json({
      message: "Медецинская услуга была успешно удалено",
      redirect: "/admin/auth/services",
    });
  } catch (e) {
    return res.json({ message: e.message });
  }
};
