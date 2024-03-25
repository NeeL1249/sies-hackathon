import userRoutes from "./routes/user.routes.js";
import express from "express";
import session from "express-session";

const port = 3000;
const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
