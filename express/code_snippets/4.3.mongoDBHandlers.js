const handleInvalidIdDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;

  return new AppErrorClass(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  if (!err.errmsg) return new AppErrorClass("duplicate field value error", 400);

  const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const value = match ? match[0] : "duplicate value";
  const message = `duplicate field value: ${value}. please use another value`;

  return new AppErrorClass(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input: ${errors.join(". ")}`;

  return new AppErrorClass(message, 400);
};
