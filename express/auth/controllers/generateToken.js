import jwt from "jsonwebtoken";
// also get access to the jwt_secret.

export const generateToken = (id) => {
  return jwt.sign({ id }, "process.env.JWT_SECRET", { expiresIn: "1h" });
};
