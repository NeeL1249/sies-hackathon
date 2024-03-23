// Import necessary modules
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import session from "express-session";
import AppError from "../utils/error.util.js";
import db from "../database/db.js";
import express from "express";

const app = express();

const saltRounds = 10;

// Initialize passport and session middleware
// Assuming `app` is defined elsewhere in your code
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

app.use(passport.initialize());
app.use(passport.session());

// Define the register function
const register = async (req, res, next) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      return res.redirect("/login");
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      const result = await db.query(
        "INSERT INTO users (email, paswd) VALUES ($1, $2) RETURNING *",
        [email, hash]
      );
      const user = result.rows[0];
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/secrets");
      });
    }
  } catch (err) {
    return next(
      new AppError("User registration failed, please try again", 400)
    );
  }
};

const secrets = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/users/login");
  }
};

// Define the login function
const login = passport.authenticate("local", {
  successRedirect: "/users/secrets",
  failureRedirect: "/users/login",
});
// Configure passport authentication strategy
passport.use(
  new Strategy(async function verify(username, password, cb) {
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1", [
        username,
      ]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.paswd;
        const match = await bcrypt.compare(password, storedHashedPassword);
        if (match) {
          return cb(null, user);
        } else {
          return cb(null, false);
        }
      } else {
        return cb(null, false); // User not found
      }
    } catch (err) {
      return cb(err);
    }
  })
);

// Serialize and deserialize user functions
passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = result.rows[0];
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

export { register, login, secrets };
