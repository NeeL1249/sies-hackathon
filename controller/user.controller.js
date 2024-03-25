import bcrypt from "bcrypt";
import db from "../database/db.js";
import express from "express";
import session from "express-session";

const app = express();
const saltRounds = 10;


const register = async (req, res, next) => {
  const email = req.body.username;
  const password = req.body.password;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      bcrypt.hash(password, saltRounds, async (err, pass) => {
        if (err) {
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", pass);
          const result = await db.query(
            "INSERT INTO users (email, paswd) VALUES ($1, $2) RETURNING *",
            [email, pass]
          );
          const userRegisteredCheck = result.rows.length;
          if (userRegisteredCheck > 0) {
            console.log(`User is registered successfully.`);
            next;
          } else {
            console.log(`User was not able to register`);
          }
        }
      });
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res, cb) => {
  const email = req.body.username;
  const password = req.body.password;
  try {
    const isUserRegistered = await db.query(
      "SELECT * FROM users WHERE email= $1",
      [email]
    );
    if (isUserRegistered.rows.length === 0) {
      console.log(`User is not registered! please register yourself first`);
    } else {
      const user = isUserRegistered.rows[0];
      const storedPassword = user.paswd;
      bcrypt.compare(password, storedPassword, async (err, result) => {
        if (err) {
          console.log(` ERROR!! in hashing the password `);
        } else {
          if (result) {
            console.log(`user successfully logged in`);
            req.session.user = user;
            res.redirect("/api/users/secrets");
            cb();
          } else {
            res.send("Incorrect Password");
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const secrets = (req, res) => {
  if (req.session.user) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/api/users/login");
  }
};

export { register, login, secrets };
