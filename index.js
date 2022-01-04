import express from  "express"
import cors from  "cors"
import path from "path"
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

import { user } from "./backend/routes/index.js";
import { router } from "./backend/routes/index.js"

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "frontend", "pages"));
app.use(express.static(path.resolve(__dirname, "frontend", "static")));

app.use(async function (req, res) {
    res.status(404).render("404", {
        title: "Ошибка",
        resources: {
            css: [],
            js: []
        },
        user
    });
});



async function start() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING)
        
        app.listen(process.env.APP_PORT, process.env.APP_IP, () =>
            console.log(`SERVER HAS BEEN STARTED AT ${process.env.APP_PORT}`)
        );
    } catch (e) {
        console.log(e.message);
    }
}


await start()
