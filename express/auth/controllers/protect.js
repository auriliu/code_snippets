import jwt from "jsonwebtoken";
import User from "../db/models/userModel.js";

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // check if authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "unauthorized." });

  const token = authHeader.split(" ")[1];

  try {
    // verify the token's validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded = decoded data from the token: user id.
    req.user = decoded;

    // e.g. acc has been removed by administrator or deleted by the user.
    // check if the user exists in the database
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "user no longer exists." });

    // check if the password has been changed after the token was issued
    const passwordChangedAt = user.passwordChangedAt.getTime() / 1000;
    // compares timestamps of id.issuedAt vs passwordChangedAt.
    if (decoded.iat < passwordChangedAt)
      return res
        .status(401)
        .json({ message: "password changed. please log in again." });

    req.user = user; // add currecntUser to the req obj. so user.role is available for restrict()

    next();
  } catch (err) {
    res.status(401).json({ message: "invalid token." });
  }
};

// // JWT error handlers:
// if (error.name === "JsonWebTokenError") (error) => handleJWTError();
// if (error.name === "TokenExpiredError") (error) => handleJWTExpiredError();
// const handleJWTError = () => new AppError("invalid token", 401)
// const handleJWTExpiredError = () => new AppError("expired token", 401)
