import mongoose from "mongoose";
import { Router } from "express";
import { Controllers } from "../controllers/controllers.js";
import { check } from "express-validator";
import { bread_crumbs, check_role } from "../middewares/middlewares.js";
import { aggregate, get_all, get_one } from "../controllers/get-controllers.js";
import {
  create_doctor,
  create_medicine_direction,
  create_services,
  delete_doctor,
  delete_medicine_direction,
  delete_services,
  update_doctor,
  update_medicine_direction,
  update_services,
} from "../controllers/auth-controllers.js";
import multer from "multer";

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

  const js = ["/js/swiper.js", "/js/main-page.js"];
  const css = [
    "/css/swiper.css",
    "/css/fixed-socials.css",
    "/css/main-page.css",
  ];

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
      $facet: {
        // data: [{ $skip: skip }, { $limit: limit }],
        data: [
          {
            $lookup: {
              from: "medicine_directions",
              localField: "medicine_direction_ids",
              foreignField: "_id",
              as: "medicine_directions",
            },
          },
        ],
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

router.get("/contacts", async (req, res) => {
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const pageText = await get_texts({ page: "main" });
  const breadcrumbs = req.breadcrumbs;

  const js = [];
  const css = [
    "/css/fixed-socials.css",
    "/css/contacts.css",
    "/css/breadcrumbs.css",
  ];

  user = req.user ? req.user : false;
  if (req.user && req.user.roles.includes("ADMIN")) {
    isAdmin = true;
    js.push("/js/admin.js");
    css.push("/css/admin.css");
  }

  res.render("contacts", {
    title: "Контакты",
    resources: { css, js },
    isAdmin,
    pageText,
    user,
    linkActive: "/contacts",
    headerText,
    footer,
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

router.get("/admin/auth/doctors", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });

  let params = [
    {
      $facet: {
        // data: [{ $skip: skip }, { $limit: limit }],
        data: [
          {
            $lookup: {
              from: "medicine_directions",
              localField: "medicine_direction_ids",
              foreignField: "_id",
              as: "medicine_directions",
            },
          },
        ],
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

  const doctors = await aggregate("doctors", params);

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctors-list-auth.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("doctors-list-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    fetch_url: "/admin/auth/doctors/delete",
    headerText,
    footer,
    doctors: doctors[0],
    user,
  });
});

router.get("/admin/auth/doctors/create", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const directions = await get_all("medicine_directions");

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctor-create.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("doctors-create-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    fetch_url: "/admin/auth/doctors/create",
    headerText,
    directions,
    footer,
    user,
  });
});

router.get("/admin/auth/doctors/:id", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const directions = await get_all("medicine_directions");
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

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctor-create.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("doctor-edit-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    headerText,
    directions,
    fetch_url: "/admin/auth/doctors/edit",
    currentDoctor: currentDoctor[0],
    footer,
    user,
  });
});

router.get("/admin/auth/medicine_directions", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const directions = await get_all("medicine_directions");

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctors-list-auth.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("medicine-directions-list-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    headerText,
    fetch_url: "/admin/auth/medicine_directions/delete",
    directions,
    footer,
    user,
  });
});

router.get("/admin/auth/medicine_directions/create", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctor-create.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("medicine-directions-create-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    fetch_url: "/admin/auth/medicine_directions/create",
    headerText,
    footer,
    user,
  });
});

router.get("/admin/auth/medicine_directions/:urlName", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
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

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctor-create.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("medicine-directions-edit-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    headerText,
    fetch_url: "/admin/auth/medicine_directions/edit",
    currentDirection: currentDirection[0],
    footer,
    user,
  });
});

router.get("/admin/auth/services", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const services = await get_all("services");

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctors-list-auth.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("services-list-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    headerText,
    fetch_url: "/admin/auth/services/delete",
    services,
    footer,
    user,
  });
});

router.get("/admin/auth/services/create", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const directions = await get_all("medicine_directions");

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctor-create.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("services-create-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    headerText,
    directions,
    fetch_url: "/admin/auth/services/create",
    footer,
    user,
  });
});

router.get("/admin/auth/services/:id", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });
  const directions = await get_all("medicine_directions");
  const currentService = await get_one("services", {
    _id: mongoose.Types.ObjectId(req.params.id),
  });

  const js = ["/js/auth.js", "/js/admin.js", "/js/doctor-create.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  user = req.user ?? false;
  isAdmin = true;

  res.render("services-edit-auth", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    headerText,
    currentService,
    directions,
    fetch_url: "/admin/auth/services/edit",
    footer,
    user,
  });
});

router.get("/admin/panel", async (req, res) => {
  if (!req.user || !req.user.roles.includes("ADMIN")) return res.redirect("/");
  const headerText = await get_texts({ page: "header" });
  const footer = await get_texts({ page: "footer" });

  const js = ["/js/auth.js", "/js/admin.js"];
  const css = ["/css/auth.css", "/css/admin.css"];

  res.render("admin", {
    title: "admin",
    resources: {
      css,
      js,
    },
    linkActive: "",
    isAdmin,
    headerText,
    footer,
    user,
  });
});

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./frontend/static/images/doctors");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/admin/auth/doctors/create", create_doctor);
router.post("/admin/auth/doctors/edit", update_doctor);
router.post("/admin/auth/doctors/delete", delete_doctor);
router.post(
  "/admin/auth/medicine_directions/create",
  create_medicine_direction
);
router.post("/admin/auth/medicine_directions/edit", update_medicine_direction);
router.post(
  "/admin/auth/medicine_directions/delete",
  delete_medicine_direction
);
router.post("/admin/auth/services/create", create_services);
router.post("/admin/auth/services/edit", update_services);
router.post("/admin/auth/services/delete", delete_services);
router.post("/image_uploader", upload.single("file"), (req, res) => {
  res.json({ url: `/images/doctors/${req.file.originalname}` });
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
