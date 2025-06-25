app.use((err, req, res, next) => {
  //   read properties from the err obj or default values
  err.status = err.status || "error";
  err.statusCode = err.statusCode || "500";

  //   response to the err received from the next() (3)
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
