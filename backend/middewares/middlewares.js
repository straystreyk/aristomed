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
      const token = req.cookies.token
    }
    console.log(e.message);
  }
  next();
};
