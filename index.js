import express from "express";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import os from "os";
import dotenv from "dotenv";

import { user } from "./backend/routes/index.js";
import { router } from "./backend/routes/index.js";
import { get_texts } from "./backend/controllers/text-controllers.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();
let isAdmin = false;

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "frontend", "pages"));
app.use(express.static(path.resolve(__dirname, "frontend", "static")));

app.use(async function (req, res) {
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });

  const js = [];
  const css = [];

  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }
  res.status(404).render("404", {
    title: "Ошибка",
    resources: { css, js },
    user,
    linkActive: "",
    isAdmin,
    headerText,
    footer,
  });
});

async function start() {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    app.listen(process.env.APP_PORT, process.env.APP_IP, () =>
      console.log(`SERVER HAS BEEN STARTED AT ${process.env.APP_PORT}`)
    );
  } catch (e) {
    console.log(e.message);
  }
}

await start();
