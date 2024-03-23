// user.routes.js
import express from "express";
import { register, login,secrets } from "../controller/user.controller.js";
import passport from "passport";

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
  "/login",login,
  passport.authenticate("local", {
    successRedirect: "/users/secrets",
    failureRedirect: "/users/login",
  })
);
router.get("/secrets",secrets);

export default router;
