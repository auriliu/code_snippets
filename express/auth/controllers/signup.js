import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "user already exists." });

    const newUser = new User({
      email,
      password, // plain password, will be hashed by schema pre-save hook
    });

    await newUser.save();

    // auto user login
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      "process.env.JWT_SECRET",
      { expiresIn: "1h" }
    );

    res.status(201).json({ message: "user created.", token });
    // end of auto user login
  } catch (err) {
    res.status(500).json({ message: "server error." });
  }
};
