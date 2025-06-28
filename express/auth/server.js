import express from "express";

import connectDB from "./db/db.js";
import { globalErrorHandler } from "./middelware/error.middleware.js";
import { signup, getAllUsers } from "./controllers/auth.controllers.js";
import { login } from "./controllers/login.js";

import { protect } from "./controllers/protect.js";

const app = express();
connectDB();

app.use(express.json()); //not needed yet.

// middleware
// global error handler

// routes
// app.use matches all routes starting with the path.
// app.get matches the exact path only.

// app.use(path, middleware)
// runs for all HTTP methods (get, post, etc) and any route starting with path.

// app.all(path, handler)
// runs for all HTTP methods, but only for the exact route path.

app.post("/api/v1/signup", signup);
app.post("/api/v1/login", login);

// app.post("/api/v1/users", createUser);
app.get("/api/v1/users", protect, getAllUsers);
// app.get("/api/v1/users", protect, restrict, deleteUser);

// testing global error handler:
// app.get("/error", (req, res, next) => {
//   const err = new Error("this is a test error");
//   next(err);
// });

app.all("*", (req, res, next) => {
  console.log("accessing undefined route");
  res.send("undefined route");
});

app.use(globalErrorHandler);

app.listen(9000, () => {
  console.log("the server is up on 9000");
});
