import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../db/models/userModel.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if email exists: do i need to add: .select("+password") ??
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "invalid credentials." });

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "invalid credentials." });

    // issue the token
    const token = jwt.sign({ id: user._id }, "JWT_SECRET_PLACEHOLDER", {
      expiresIn: "1h",
    });

    // send it to the client.
    res.status(200).json({ message: "login successful.", token });
  } catch (err) {
    res.status(500).json({ message: "server error." });
  }
};
