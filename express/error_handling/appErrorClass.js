// error class takes an err obj(message, code) and adds more properties to it
class AppErrorClass extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    // this.isOperational = true, marks the error as operational/expected (e.g. invalid input, not found).
    // but how do u knwo??

    // you don’t.
    // you set isOperational = true only when you create the error intentionally (e.g. using AppErrorClass).
    // unexpected or system errors (like a bug, undefined is not a function) won’t have this flag—so you can tell them apart.

    // helps distinguish it from programming bugs or unknown errors.
    // useful in error handling to decide what to log or show to users.

    Error.captureStackTrace(this, this.constructor); // shows where the error occured.
  }
}

export default AppErrorClass;

// it creates a custom error object with:
//    message (from super(message))
//    statusCode (e.g. 404, 500)
//    status ("fail" for 4xx, "error" for 5xx)
//    isOperational = true (marks it as expected)
//    stack trace (via captureStackTrace)

// ///////////////////////////////////////////////////////////////////////
// with ERROR_CLASS

// app.all("*", (req, res, next) => {
//   next(new AppError("accessing undefined route", 404));
// });

// ///////////////////////////////////////////////////////////////////////
// without ERROR_CLASS

// app.all("*", (req, res, next) => {
//   const err = new Error("accessing undefined route");
//   err.status = "fail";
//   err.statusCode = 404;
//   next(err);
// });
