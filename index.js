import userRoutes from "./routes/user.routes.js";
import express from "express";

const port = 3000;

const app = express();

app.use("/ping", (req, res) => {
  res.send("/pong");
});

app.use("/",userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
