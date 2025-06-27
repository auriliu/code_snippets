const sendDevelopmentError = (res, err) => {
  res.status(err.statusCode).json({
    // as much as possible
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
