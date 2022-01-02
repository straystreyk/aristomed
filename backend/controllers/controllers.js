import {registration, login} from "./auth-controllers.js";
import {get_texts, update_text} from "./text-controllers.js";

const cacheControl = (req, res, next) => {
    res.set("Cache-control", "no-store");
    next();
}

export const Controllers = {
    registration,
    login,
    get_texts,
    update_text,
    cacheControl
}