import { Router } from "express";
import { Controllers } from "../controllers/controllers.js";
import { check } from "express-validator";
import { check_role } from "../middewares/middlewares.js";
import {get_all_doctors} from "../controllers/get-controllers.js";

const { login, registration, get_texts, update_text, cacheControl, getAll } =
  Controllers;
let isAdmin = false;
export let user = false;
export const router = Router();

router.use(check_role);
router.use(cacheControl);

//-----PAGES------
router.get("/", async (req, res) => {
  const text = await get_texts("main");
  const js = [];
  const css = [];

  user = req.user ? req.user : false;
  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }

  res.render("main-page", {
    title: "Главная страница",
    resources: { css, js },
    text,
    isAdmin,
    user,
  });
});

router.get("/doctors", async (req, res) => {
  const doctors = await get_all_doctors()
  const js = ["/js/doctors.js"];
  const css = ["/css/doctors.css"];

  user = req.user ? req.user : false;
  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }

  res.render("doctors-page", {
    title: "doctors",
    resources: { css, js },
    isAdmin,
    user,
    doctors
  });
});

router.get("/admin/auth", (req, res) => {
  if (req.user) return res.redirect("/");

  res.render("auth-admin", {
    title: "admin",
    resources: {
      css: ["/css/auth.css"],
      js: ["/js/auth.js"],
    },
    isAdmin,
    user,
  });
});

//------------API---------------

//Search
// router.post("/search", async (req, res) => {
//     const data = await getAll(req.body.value)
//
//     res.json(data)
// })

//Text
router.post("/text_update", update_text);

//Admin
router.post("/admin/auth/login", login);
router.post(
  "/admin/auth/registration",
  [
    check("login", "Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть больше 4").isLength({ min: 4 }),
  ],
  registration
);
