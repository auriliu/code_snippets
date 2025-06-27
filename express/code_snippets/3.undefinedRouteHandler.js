import CustomErrorClass from "./2.CustomErrorClass.js";

export const undefinedRouteHandler = (req, res, next) => {
  next(new CustomErrorClass("accessing undefined route 2.0", 404));
};
