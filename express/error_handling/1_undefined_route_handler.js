// ///////////////////////////////////////////////////////////////////////
// CLEAN: all together.
// ///////////////////////////////////////////////////////////////////////

// [2] undefinedRouteHandler kicks in, sends err obj via next()
export const undefinedRouteHandler = (req, res, next) => {
  //   define the error obj (1)
  const err = new Error("accessing undefined route");
  err.status = "fail";
  err.statusCode = 404;
  //  send the err obj to the global err hd mw(2)
  next(err);
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

app.all("*", undefinedRouteHandler); // [1] accessing undefined route
app.use(globalErrorHandler); // GLOBAL ERR HD MW must be last

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
