import userRoutes from "./routes/user.routes.js";
import express from "express";

const port = 3000;
const app = express();

// app.use(
//   session({
//     secret: "hi hello",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//     },
//   })
// );

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
