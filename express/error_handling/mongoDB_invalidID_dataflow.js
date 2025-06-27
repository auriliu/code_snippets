// 1. route
app.get("/user/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id); // triggers CastError if id is invalid
    if (!user) return next(new AppErrorClass("no user found", 404));
    res.status(200).json({ user });
  } catch (err) {
    next(err); // 2. forward to global handler
  }
});

// 3. global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "production") {
    let error = Object.create(err); // 4. preserve prototype

    // 5. identify CastError
    if (error.name === "CastError") {
      error = handleInvalidIdDB(error); // 6. transform
    }

    sendProductionError(res, error); // 7. respond
  } else {
    // dev mode
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  }
});

// util: transform function
const handleInvalidIdDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;
  return new AppErrorClass(message, 400);
};

// util: send prod error
const sendProductionError = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};
