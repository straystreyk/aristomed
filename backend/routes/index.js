import { Router } from "express";

export const router = Router();

router.get("/", (req, res) => {
    res.render("main-page", {
        title: "Главная страница"
    })
})
