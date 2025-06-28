// export const logout = (req, res) => {
//   res.status(200).json({ message: "logout successful." });
// };

// on the frontend:

// set token cookie on login (example)
res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 3600000, // 1 hour in ms
});

// clear token cookie on logout
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "logout successful." });
};
