const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const Client = require("../models/Client.model");


////////// CLIENT SIGNUP //////////

//Client Signup Form
router.get("/client-signup", (req, res, next) => {
  (res.render("client-auth/signup.hbs"))
});

//Client Signup (creating client account)
router.post("/client-signup", (req, res, next) => {

  const { username, firstName, lastName, email, userPassword } = req.body;

  if (!username || !email || !userPassword || !firstName || !lastName ) {
    res.render("client-auth/signup.hbs", {
      errorMessage: "All fields are mandatory."
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(userPassword)) {
    res.render("client-auth/signup.hbs", {
      errorMessage:
        "Password must contain at least: 6 characters, one number, one lowercase letter and one uppercase letter."
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(userPassword, salt))
    .then((hashedPassword) => {
      return Client.create({
        username,
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
      }).then((userFromDB) => {
        res.redirect("/client-login");
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.render("client-auth/signup.hbs", {
          errorMessage: "Email/Username already in use. Please try again."
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.render("client-auth/signup.hbs", { errorMessage: err.message });
      } else {
        console.log("Error while creating a user:", err);
      }
    });
});


////////// CLIENT LOGIN //////////

// Login form
router.get("/client-login", (req, res, next) => {
  res.render("client-auth/login.hbs");
});

// Login
router.post("/client-login", (req, res, next) => {
  const { email, userPassword } = req.body;

  if (!email || !userPassword) {
    res.render("client-auth/login.hbs", {
      errorMessage: "All fields are mandatory. Please provide email and password."
    });
    return;
  }

  Client.findOne({ email })
    .then((responseFromDB) => {

      if (!responseFromDB) {
        res.render("client-auth/login.hbs", { errorMessage: "Email not found. Please try again." });
      } else if (bcryptjs.compareSync(userPassword, responseFromDB.passwordHash)) {

        req.session.currentClient = responseFromDB;


        res.redirect("/my-inquiries");
      } else {
        res.render("client-auth/login.hbs", { errorMessage: "Incorrect password." });
      }
    })
    .catch((err) => console.log(`Error while user login: ${err}`));
});


// Logout
router.post("/logout", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});


module.exports = router;