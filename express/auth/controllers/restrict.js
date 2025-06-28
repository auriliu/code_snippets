// app.get("/api/v1/users", protect, restrict, deleteUser);

// protect: make sure user is logged in.
// restrict: make sure user has authority to interact with the resource.

const restrict = (...roles) => {
  return (req, res, next) => {
    // protect() has to put currentUser on the req obj.
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "you do not have permission to perform this action.",
      });
    }
    next();
  };
};

router.get("/admin-data", protect, restrict("admin"), deleteUser);

const userSchema = new mongoose.Schema({
  // other fields...
  role: {
    type: String,
    enum: ["user", "admin", "moderator"],
    default: "user",
  },
});
