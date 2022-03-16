import mongoose from "mongoose";
import { Router } from "express";
import { Controllers } from "../controllers/controllers.js";
import { check } from "express-validator";
import { bread_crumbs, check_role } from "../middewares/middlewares.js";
import { aggregate, get_all } from "../controllers/get-controllers.js";

const { login, registration, get_texts, update_text, cacheControl, test } =
  Controllers;
let isAdmin = false;
export let user = false;
export const router = Router();

router.use(check_role);
router.use(bread_crumbs);
router.use(cacheControl);

//-----PAGES------
router.get("/", async (req, res) => {
  const pageText = await get_texts({ page: "main" });
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });

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

router.get("/doctors", async (req, res) => {
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const breadcrumbs = req.breadcrumbs;

  let { page = 1, limit = 9, medicine_direction } = req.query;

  const skip = (page - 1) * limit;

  let params = [
    {
      $lookup: {
        from: "medicine_directions",
        localField: "medicine_direction_ids",
        foreignField: "_id",
        as: "medicine_directions",
      },
    },
    {
      $facet: {
        // if u need pagination
        // data: [{ $skip: skip }, { $limit: limit }],
        data: [],
        metadata: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
            },
          },
        ],
      },
    },
  ];

  if (medicine_direction) {
    params = [
      {
        $match: {
          medicine_direction_ids: mongoose.Types.ObjectId(medicine_direction),
        },
      },
      ...params,
    ];
  }

  const doctors = await aggregate("doctors", params);
  const all_medicine_directions = await get_all("medicine_directions").then(
    (data) =>
      data.filter(
        (el) =>
          ![
            "consultations_of_narrow_specialists",
            "consultations_of_wide_specialists",
          ].includes(el.urlName)
      )
  );

  const js = ["/js/doctors.js"];
  const css = ["/css/doctors.css", "/css/breadcrumbs.css"];

  user = req.user ? req.user : false;
  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }

  res.render("doctors-page", {
    title: "Наши врачи",
    resources: { css, js },
    isAdmin,
    doctors: doctors[0].data,
    metadata: doctors[0].metadata[0],
    all_medicine_directions,
    page,
    user,
    active_select: medicine_direction ?? false,
    linkActive: "/doctors",
    headerText,
    breadcrumbs,
    footer,
  });
});

router.get("/doctors/:id", async (req, res) => {
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });

  const currentDoctor = await aggregate("doctors", [
    {
      $lookup: {
        from: "medicine_directions",
        localField: "medicine_direction_ids",
        foreignField: "_id",
        as: "medicine_directions",
      },
    },
    { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
  ]);

  const breadcrumbs = req.breadcrumbs.map((el) =>
    el.breadcrumbUrl.includes(req.params.id)
      ? {
          ...el,
          breadcrumbName: `${currentDoctor[0].surname} ${currentDoctor[0].name} ${currentDoctor[0].middle_name}`,
        }
      : el
  );

  const js = [];
  const css = [
    "/css/fixed-socials.css",
    "/css/doctor-detail.css",
    "/css/breadcrumbs.css",
  ];

  user = req.user ? req.user : false;
  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }

  res.render("doctor-detail", {
    title: `${currentDoctor[0].surname} ${currentDoctor[0].name} ${currentDoctor[0].middle_name}`,
    resources: { css, js },
    isAdmin,
    currentDoctor: currentDoctor[0],
    user,
    linkActive: "/doctors",
    headerText,
    breadcrumbs,
    footer,
  });
});

router.get("/services", async (req, res) => {
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const directions = await get_all("medicine_directions");
  const breadcrumbs = req.breadcrumbs;

  const js = [];
  const css = [
    "/css/fixed-socials.css",
    "/css/services.css",
    "/css/breadcrumbs.css",
  ];

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
    breadcrumbs,
  });
});

router.get("/services/:urlName", async (req, res) => {
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });

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

  const breadcrumbs = req.breadcrumbs.map((el) =>
    el.breadcrumbUrl.includes(req.params.urlName)
      ? {
          ...el,
          breadcrumbName: `${currentDirection[0].name}`,
        }
      : el
  );

  const js = [];
  const css = [
    "/css/fixed-socials.css",
    "/css/service-detail.css",
    "/css/breadcrumbs.css",
  ];

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
    breadcrumbs,
  });
});

//admin
router.get("/admin/auth", async (req, res) => {
  if (req.user) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });

  res.render("auth-admin", {
    title: "admin",
    resources: {
      css: ["/css/auth.css"],
      js: ["/js/auth.js"],
    },
    linkActive: "",
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
