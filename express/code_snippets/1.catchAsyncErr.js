export const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

// ///////////////////////////////////////////////////////////////////////
// with explanation
const catchAsync_messy = (fn) => {
  // u need anonymous f(), as with: { ()=>{} }
  // otherwise u ll call it right away.
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
    // all rejected promises have .catch() method.
    // 1. use .catch() instead of try/catch.
    // 2. pass that error to the next()
  };
};

// ///////////////////////////////////////////////////////////////////////
// with the wrapper: removes try/catch block entirely.
const getUsers = catchAsync(async (req, res) => {
  res.send("get all user");
});

// ///////////////////////////////////////////////////////////////////////
// without the wrapper
const getUsers_wo = async (req, res) => {
  try {
    res.send("get all movies");
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
