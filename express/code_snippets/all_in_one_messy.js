import express from "express";
const app = express();

import AppErrorClass from "./AppErrorClass.js";

// process.on("uncaughtException", () => {
//   console.log("unhandled exception! 😲 shutting down...");
//   console.log(err.name, err.message);
//   process.exit(1);
// });
// use try/catch instead.

// ///////////////////////////////////////////////////////////////////////
// CLEAN. covering: undefinedRouteHandler + globalErrorHandler + error class.
// all in one place to see how data flows.
// ///////////////////////////////////////////////////////////////////////

// [2] w/o err class: undefinedRouteHandler kicks in, sends err obj via next()
const undefinedRouteHandler_wo_err_class = (req, res, next) => {
  //   define the error obj (1)
  const err = new Error("accessing undefined route");
  //   err.message = "accessing undefined route";
  err.status = "fail";
  err.statusCode = 404;

  //  send the err obj to the global err hd mw(2)
  next(err);
};

// [2] with error class:
const undefinedRouteHandler = (req, res, next) => {
  next(new AppErrorClass("accessing undefined route 2.0", 404));
};

// [3]  globalErrorHandler receives err obj from next(), send a response.
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

// production vs development handlers:
const sendProductionError = (res, err) => {
  if (err.isOperational) {
    // ERRS FROM MONGOOSE R NOT MARKED AS OPERATIONAL.

    res.status(err.statusCode).json({
      // as little as possible
      status: err.status,
      message: err.message,
    });
  } else {
    // unknown errors, dont leak the details to the client.
    console.error("error 😤", err);

    // send even less
    res.status(500).json({
      status: "error",
      message: "something went wrong.",
    });
  }
};

const sendDevelopmentError = (res, err) => {
  res.status(err.statusCode).json({
    // as much as possible
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// mongoDB error handlers:
const handleInvalidId = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new appError(message, 400);
};
const handleDublicateName = (err) => {
  const msgSource = err.errmsg || err.message || "";
  const value = msgSource.match(/([""])(\\?.)*\1/)[0];
  const message = `duplicate field value: ${value}. use another value`;
  return new appError(message, 400);
};
const handleValidation = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input: ${errors.join(". ")}`;
  return new appError(message, 400);
};

// [3]  globalErrorHandler receives err obj from next(), send a response.
const globalErrorHandler_w_env = (err, req, res, next) => {
  const env = "development";

  err.status = err.status || "error";
  err.statusCode = err.statusCode || "500";

  if (env === "development") {
    sendDevelopmentError(res, err);
  }

  if (env === "production") {
    // let error = { ...err };
    let error = Object.create(err);

    // mongoDB errors:
    if (error.name === "CastError") error = handleInvalidId(error); // invalid id
    if (error.code === 11000) error = handleDublicateName(error); // duplicate
    if (error.name === "ValidationError") error = handleValidation(error); // validation

    sendProductionError(res, error);
  }
};

app.all("*", undefinedRouteHandler); // [1] accessing undefined route
app.use(globalErrorHandler); // GLOBAL ERR HD MW must be last

// ///////////////////////////////////////////////////////////////////////
// ///////////////////////////////////////////////////////////////////////

const server = app.listen(9000, () =>
  console.log(`the server is up at port 9000`)
);

// listens for unhandled promise rejections: async code.
// any promise that gets rejected without a .catch() or try/catch handler
//     missing .catch() on a promise .then() chain.
//     using async/await without a surrounding try/catch .
//     forgotten return in promise chains, causing rejection to go unhandled .
//     “send and forget” operations like logging without .catch()

// process.on("unhandledRejection", (err) => {
//   console.log(err.name, err.message);
//   console.log("unhandled rejection! 😲 shutting down...");
//   //   giving the server time to finish pending tasks.
//   server.close(() => {
//     process.exit(1);
//   });
// });
// dont really need this, use .catch() on rejected promises.

// ///////////////////////////////////////////////////////////////////////
// MESSY: explanation.
// ///////////////////////////////////////////////////////////////////////

const undefinedRouteHandler_MESSY = (req, res, next) => {
  // response is an error because it’s called only when the request is caught by *, which means- the route is undefined.
  //   define the error obj (1)
  const err = new Error("accessing undefined route");
  //  new Error() is a built-in js obj  to create err instances with a message and stack trace (shows where in the code err happened).

  //   text inside new Error() becomes err.message value.
  //   add additional properties:
  err.status = "fail";
  err.statusCode = 404;
  //   pass it along to the global err hd mw(2)
  next(err);
  //   err passed to next() becomes err obj in global err-hd mw.
  //   next() skips normal mws n goes to the 1st err-hd mw ((err, req, res, next)).
};
