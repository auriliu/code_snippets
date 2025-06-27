// to test it, run next(err)

export const globalErrorHandler = (err, req, res, next) => {
  const env = "development";

  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (env === "development") {
    res.status(err.statusCode).json({
      // as much as possible
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  if (env === "production") {
    // let error = { ...err };
    let error = Object.create(err);

    // MONGODB error handlers:
    if (error.name === "CastError") error = handleInvalidId(error); // invalid id
    if (error.code === 11000) error = handleDuplicateName(error); // duplicate
    if (error.name === "ValidationError") error = handleValidation(error); // validation

    if (error.isOperational) {
      // ERRS FROM MONGOOSE R NOT MARKED AS OPERATIONAL.

      res.status(error.statusCode).json({
        // as little as possible
        status: error.status,
        message: error.message,
      });
    } else {
      // unknown errors, dont leak the details to the client.
      console.error("error 😤", error);

      // send even less
      res.status(500).json({
        status: "error",
        message: "something went wrong.",
      });
    }
  }
};
