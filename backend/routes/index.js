import { Router } from "express";
import { Controllers } from "../controllers/controllers.js";
import { check } from "express-validator";
import { check_role } from "../middewares/middlewares.js";
import { aggregate, get_all, get_one } from "../controllers/get-controllers.js";

const { login, registration, get_texts, update_text, cacheControl, test } =
  Controllers;
let isAdmin = false;
export let user = false;
export const router = Router();

router.use(check_role);
router.use(cacheControl);

//-----PAGES------
router.get("/", async (req, res) => {
  const pageText = await get_texts("main");
  const headerText = await get_texts("header");
  const footer = await get_texts("footer");

  const js = ["/js/main-page.js"];
  const css = ["/css/main-page.css", "/css/fixed-socials.css"];

  user = req.user ? req.user : false;
  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }

  res.render("main-page", {
    title: "Главная страница",
    linkActive: "/",
    resources: { css, js },
    pageText,
    headerText,
    isAdmin,
    footer,
    user,
  });
});

// router.get("/doctors", async (req, res) => {
//   const headerText = await get_texts("header");
//   const footer = await get_texts("footer");
//   const js = ["/js/doctors.js"];
//   const css = ["/css/doctors.css"];
//
//   user = req.user ? req.user : false;
//   if (req.user && req.user.roles.includes("ADMIN")) {
//     isAdmin = true;
//     js.push("/js/admin.js");
//     css.push("/css/admin.css");
//   }
//
//   res.render("doctors-page", {
//     title: "doctors",
//     resources: { css, js },
//     isAdmin,
//     user,
//     linkActive: "/doctors",
//     headerText,
//     footer,
//   });
// });

router.get("/services", async (req, res) => {
  const headerText = await get_texts("header");
  const footer = await get_texts("footer");
  const directions = await get_all("medicine_directions");

  const js = [];
  const css = ["/css/fixed-socials.css", "/css/services.css"];

  user = req.user ? req.user : false;
  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }

  res.render("services", {
    title: "Услуги и цены",
    resources: { css, js },
    isAdmin,
    user,
    linkActive: "/services",
    headerText,
    footer,
    directions,
  });
});

router.get("/services/:urlName", async (req, res) => {
  const headerText = await get_texts("header");
  const footer = await get_texts("footer");

  const currentDirection = await aggregate("medicine_directions", [
    {
      $lookup: {
        from: "services",
        localField: "_id",
        foreignField: "medicineDirectionsIds",
        as: "services",
      },
    },
    {
      $match: {
        urlName: req.params.urlName,
      },
    },
  ]);

  const js = [];
  const css = ["/css/fixed-socials.css", "/css/service-detail.css"];

  user = req.user ? req.user : false;
  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }

  res.render("service-detail", {
    title: currentDirection[0].name,
    resources: { css, js },
    isAdmin,
    user,
    linkActive: "/services",
    headerText,
    footer,
    currentDirection,
  });
});

//admin
router.get("/admin/auth", async (req, res) => {
  if (req.user) return res.redirect("/");
  const headerText = await get_texts("header");
  const footer = await get_texts("footer");

  res.render("auth-admin", {
    title: "admin",
    resources: {
      css: ["/css/auth.css"],
      js: ["/js/auth.js"],
    },
    linkActive: "/doctors",
    isAdmin,
    headerText,
    footer,
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

//Test
router.post("/test", test);

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
