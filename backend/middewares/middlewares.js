import jwt from "jsonwebtoken";
export const check_role = (req, res, next) => {
    try {
        if (req.cookies.token) {
            const token = req.cookies.token;
            if (!token)
                return res
                    .status(403)
                    .json({ message: "Авторизуйтесь чтобы продолжить" });
            const decodedData = jwt.verify(token, process.env.SECRET_JWT);
            req.user = decodedData;
        }
    } catch (e) {
        console.log(e.message);
    }
    next();
}