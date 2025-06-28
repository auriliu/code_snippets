import jwt from "jsonwebtoken";
import User from "../db/models/userModel.js";

// rename createUser to signup.
// try to make an error creating user.
// see i that wrapper works.
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    //do not create a new user using the entire body obj.
    // just the necessary fields.

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "user already exists." });

    const newUser = new User({
      email,
      password,
    });

    const createdUser = await newUser.save();

    //auto login: create a token (1), send it to the user (2)
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      "JWT_SECRET_PLACEHOLDER",
      { expiresIn: "1h" }
    );

    res.status(201).json({ createdUser, message: "user created.", token });
  } catch (err) {
    res.status(500).json({ message: "server error.", err });
  }
};

export const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json({ users, message: "get all users" });
};
