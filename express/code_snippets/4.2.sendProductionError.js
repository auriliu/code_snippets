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
