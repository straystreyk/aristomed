import jwt from "jsonwebtoken";
export const check_role = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      if (!token)
        return res
          .status(403)
          .json({ message: "Авторизуйтесь чтобы продолжить" });
      const decodedData = jwt.verify(token, process.env.SECRET_JWT);
      req.user = decodedData;
    }
  } catch (e) {
    if (e.message === "jwt expired") {
      const token = req.cookies.token;
    }
    console.log(e.message);
  }
  next();
};

const breadcrumbsI18N = {
  doctors: "Наши врачи",
  services: "Услуги и цены",
  contacts: "Контакты",
};

export const bread_crumbs = (req, res, next) => {
  const urls = req.originalUrl.split("/");
  req.breadcrumbs = urls.map((url, i) => {
    if (url.includes("?")) url = url.split("?")[0];
    return {
      breadcrumbName: url === "" ? "Главная" : breadcrumbsI18N[url],
      breadcrumbUrl: url === "" ? "/" : `${urls.slice(0, i + 1).join("/")}`,
    };
  });
  next();
};
