const globalErrorHandler = (err, req, res, next) => {
  const env = "development";

  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (env === "development") {
    sendDevelopmentError(res, err);
  }

  if (env === "production") {
    // let error = { ...err };
    let error = Object.create(err);

    // MONGODB error handlers:
    if (error.name === "CastError") error = handleInvalidId(error); // invalid id
    if (error.code === 11000) error = handleDublicateName(error); // duplicate
    if (error.name === "ValidationError") error = handleValidation(error); // validation

    sendProductionError(res, error);
  }
};

//

// const globalErrorHandler = (err, req, res, next) => {
//   err.status = err.status || "error";
//   err.statusCode = err.statusCode || 500;

//   if (process.env.NODE_ENV === "development") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       error: err,
//       stack: err.stack,
//     });
//   } else {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   }
// };

//
// app.use((err, req, res, next) => {
//   let error = { ...err };
//   if (error.name === "castError") error = handleCastErrorDB(error);
//   if (error.code === 11000) error = handleDuplicateFieldsDB(error);
//   if (error.name === "validationError") error = handleValidationErrorDB(error);

//   globalErrorHandler(error, req, res, next);
// });
