import User from "../db/models/userModel.js";

// rename createUser to signup.
// try to make an error creating user.
// see i that wrapper works.
export const createUser = async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
  });

  // wrap save() in try/catch or use global error handler to catch and respond gracefully.
  const result = await newUser.save();
  res.json({ result, message: "new user created" });
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json({ users, message: "get all users" });
};
