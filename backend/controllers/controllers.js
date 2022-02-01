import { registration, login } from "./auth-controllers.js";
import { get_texts, update_text } from "./text-controllers.js";
// import { getAll } from "./search-controller.js";
import { test } from "./test.js";

const cacheControl = (req, res, next) => {
  res.set("Cache-control", "no-store");
  res.set("SameSite", "None");
  res.set("Secure");
  next();
};

export const Controllers = {
  registration,
  login,
  get_texts,
  update_text,
  cacheControl,
  test,
};
