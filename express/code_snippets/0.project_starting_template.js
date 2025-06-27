import express from "express";
const app = express();

app.use(express.json()); // middleware to parse json

// simple test route
app.get("/", (req, res) => {
  res.send("server is running");
});

// global error handler placeholder
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: "error", message: "internal server error" });
});

app.listen(9000, () => console.log(`the server is up at port 9000`));
