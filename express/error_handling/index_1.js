import express from "express";
import AppErrorClass from "./appErrorClass.js";
import { catchAsync } from "./catchAsyncErr.js";

const app = express();

const globalErrorHandler = (err, req, res, next) => {
  //   read properties from the err obj or default values
  err.status = err.status || "error";
  err.statusCode = err.statusCode || "500";

  //   response to the err received from the next() (3)
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

// export const catchAsync = (fn) => {
//   return (req, res, next) => {
//     fn(req, res, next).catch((err) => next(err));
//   };
// };

// ///////////////////////////////////////////////////////////////////////
// with the wrapper: removes try/catch block entirely.

const getUsers = catchAsync(async (req, res) => {
  console.log("testing async");
  throw new Error("something went wrong");
  // res.send("getting users");
});

app.get("/users", getUsers);

app.use(globalErrorHandler); // GLOBAL ERR HD MW must be last

// ///////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////

app.listen(9002, () => console.log(`the server is up at port 9002`));
