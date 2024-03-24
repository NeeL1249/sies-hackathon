// user.routes.js
import express from "express";
import {
  register,
  initialize,
  secrets,
} from "../controller/user.controller.js";
import passport from "passport";
import session from "express-session";
import env from "dotenv";

const app = express();

env.config();

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.ejs");
});
router.get("/register", (req, res) => {
  res.render("register.ejs");
});
router.get("/login", (req, res) => {
  res.render("login.ejs");
});
router.post("/register", register);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/login",
    failureRedirect: "/users/secrets",
  })
);

router.get("/secrets", secrets);

export default router;
