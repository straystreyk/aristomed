import {Router} from "express";
import {Controllers} from "../controllers/controllers.js";
import {check} from "express-validator";
import {check_role} from "../middewares/middlewares.js";

const { login, registration, get_texts, update_text } = Controllers
let isAdmin

export const router = Router();
router.use(check_role)

//GET
router.get("/", async (req, res) => {
    const text = await get_texts("main")
    const js = []
    const css = []

    if (req.user && req.user.roles.includes("ADMIN") ) {
        isAdmin = true
        js.push("/js/admin.js")
        css.push("/css/admin.css")
    } else {
        isAdmin = false
    }

    res.render("main-page", {
        title: "Главная страница",
        resources: {css, js},
        text,
        isAdmin
    })
})

router.get("/admin/auth", (req, res) => {
    res.render("auth-admin", {
        title: "admin",
        resources: {
            css: ["/css/auth.css"],
            js: ["/js/auth.js"],
        }
    })
})

//API

//Text
router.post("/text_update", update_text)

//Admin
router.post("/admin/auth/login", login)
router.post("/admin/auth/registration", [
    check("login", "Имя пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль должен быть больше 4").isLength({min: 4})
], registration)