import express from "express";

const app = express();

app.all("*", (req, res, next) => {
  const err = new Error("accessing undefined route");
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});

// GLOBAL ERR HD MW:
app.use((err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || "500";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(9000, () => console.log(`the server is up at port 9000`));

// going for: http://127.0.0.1:9000 will return:
// {
//     "status": "fail",
//     "message": "accessing undefined route"
// }
