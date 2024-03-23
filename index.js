import userRoutes from "./routes/user.routes.js";
import express from "express";
import passport from "passport";
import session from "express-session";

const app = express();

// Initialize session middleware
app.use(
  session({
    secret: "hi hello",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Import and use user routes
app.use("/users", userRoutes);

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
