import jwt from "jsonwebtoken";
import {get_texts} from "../controllers/text-controllers.js";
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
//
// //Забирает все тексты для хедера и футера
// export const getAllPagesTexts = await (req, res, next) => {
//   try {
//     const headerText = await get_texts("header");
//     req.texts.header = headerText
//   } catch (e) {
//     console.log(e.message)
//   }
//   next();
// }
