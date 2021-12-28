import express from  "express"
import cors from  "cors"
import path from "path"
import mongoose from "mongoose";
import dotenv from "dotenv"
import { router } from "./backend/routes/index.js"

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use(router);

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "frontend", "pages"));
app.use(express.static(path.resolve(__dirname, "frontend", "static")));

app.use(function (req, res) {
    res.status(404).render("404", {
        title: "Ошибка",
        resources: {
            css: [],
            js: []
        }
    });
});


const PORT = process.env.PORT;

async function start() {
    try {
        await mongoose.connect(process.env.mongo)
        app.listen(PORT, () =>
            console.log(`SERVER HAS BEEN STARTED AT ${PORT}`)
        );
    } catch (e) {
        console.log(e.message);
    }
}



await start()
