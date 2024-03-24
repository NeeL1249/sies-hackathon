// // Import necessary modules
// import passport from "passport";
// import bcrypt from "bcrypt";
// import { Strategy } from "passport-local";
// import session from "express-session";
// import AppError from "../utils/error.util.js";
// import db from "../database/db.js";
// import express from "express";

// // const app = express();
// const saltRounds = 10;

// // Initialize passport and session middleware
// // Assuming `app` is defined elsewhere in your code
// // app.use(
// //   session({
// //     secret: "hi hello",
// //     resave: false,
// //     saveUninitialized: false,
// //     cookie: {
// //       maxAge: 1000 * 60 * 60 * 24 * 7,
// //     },
// //   })
// // );


// const register = async (req, res) => {
//   const email = req.body.username;
//   const password = req.body.password;

//   try {
//     const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
//       email,
//     ]);

//     if (checkResult.rows.length > 0) {
//       res.send("Email already exists. Try logging in.");
//     } else {
//       bcrypt.hash(password, saltRounds, async (err, hash) => {
//         if (err) {
//           console.error("Error hashing password:", err);
//         } else {
//           console.log("Hashed Password:", hash);
//           const result = await db.query(
//             "INSERT INTO users (email, paswd) VALUES ($1, $2) RETURNING *",
//             [email, hash]
//           );
//           const user = result.rows[0];
//           req.login(user, (err) => {
//             if (err) {
//               console.log(err);
//             } else {
//               res.redirect("/users/secrets");
//             }
//           });
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// const secrets = (req, res) => {
//   if (req.isAuthenticated()) {
//     res.render("secrets.ejs");
//   } else {
//     res.redirect("/users/login");
//   }
// };
// function initialize(passport) {
//   const app = express();
  
//   app.use(passport.initialize());
//   app.use(passport.session());

//   paasport.use(
//     new Strategy(async function verify(username, password, cb) {
//       try {
//         const result = await db.query("SELECT * FROM users WHERE email = $1", [
//           username,
//         ]);
//         if (result.rows.length > 0) {
//           const user = result.rows[0];
//           const storedHashedPassword = user.paswd;
//           bcrypt.compare(password, storedHashedPassword, (err, result) => {
//             if (err) {
//               console.error("Error comparing passwords:", err);
//               return cb(err);
//             } else {
//               if (result) {
//                 return cb(null, user);
//               } else {
//                 return cb(null, false);
//               }
//             }
//           });
//         } else {
//           res.send("User not found");
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     })
//   );
//   passport.serializeUser((user, cb) => {
//     return cb(null, user);
//   });
//   passport.deserializeUser((user, cb) => {
//     return cb(null, user);
//   });
// }
// export { register, initialize, secrets };

// Import necessary modules
import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy } from "passport-local";
import session from "express-session";
import AppError from "../utils/error.util.js";
import db from "../database/db.js";
import express from "express";

// const app = express();
const saltRounds = 10;

// Initialize passport and session middleware
// Assuming `app` is defined elsewhere in your code
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


const register = async (req, res) => {
  // Destructure `username` and `password` from the request body
  const { username: email, password } = req.body;

  try {
    // Check if the email already exists in the database
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // If the email already exists, respond with "Email already exists. Try logging in."
    if (checkResult.rows.length > 0) {
      return res.send("Email already exists. Try logging in.");
    }

    // Hash the password
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.error("Error hashing password:", err);
      } else {
        console.log("Hashed Password:", hash);

        // Insert the user into the database with the hashed password
        const result = await db.query(
          "INSERT INTO users (email, paswd) VALUES ($1, $2) RETURNING *",
          [email, hash]
        );

        // Authenticate the user and redirect to the secrets page
        const user = result.rows[0];
        req.login(user, (err) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/users/secrets");
          }
        });
      }
    });
  } catch (err) {
    console.log(err);
    // Send a proper error response if needed
    res.status(500).send("Internal Server Error");
  }
};

const secrets = (req, res) => {
  if (req.isAuthenticated()) {
    res.render("secrets.ejs");
  } else {
    res.redirect("/users/login");
  }
};

function initialize(passport) {
  const app = express();

  // Initialize Passport and session middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure the Passport local authentication strategy
  passport.use(
    new Strategy(async function verify(username, password, cb) {
      try {
        // Query the database for the user with the given email
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          username,
        ]);

        if (result.rows.length > 0) {
          const user = result.rows[0];
          const storedHashedPassword = user.paswd;

          // Compare the provided password with the hashed password
          bcrypt.compare(password, storedHashedPassword, (err, result) => {
            if (err) {
              console.error("Error comparing passwords:", err);
              return cb(err);
            }
            if (result) {
              return cb(null, user);
            } else {
              return cb(null, false);
            }
          });
        } else {
          // In this case, send a proper error response instead of rendering the user not found page
          return cb(null, false, { message: "User not found" });
        }
      } catch (err) {
        console.log(err);
        
       