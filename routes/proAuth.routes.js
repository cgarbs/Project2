const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const Job = require('../models/Job.model');
const Pro = require("../models/Pro.model");


////////// PRO SIGNUP //////////
// NOTE - OCCUPATION(JOBS) DOES NOT REPOPULATE UPON RE-RENDERING PAGE DUE TO ERROR.

//Pro Signup Form
router.get("/pro-signup", (req, res, next) => {
  Job.find()
  .then(jobsFromDB => {
    res.render('pro-auth/signup.hbs', { jobsFromDB })
  })
});

//Pro Signup (creating pro account)
router.post("/pro-signup", (req, res, next) => {

  const { username, firstName, lastName, email, userPassword, occupation } = req.body;

  if (!username || !firstName || !lastName || !email || !userPassword || !occupation ) {
    res.render("pro-auth/signup.hbs", {
      errorMessage: "All fields are mandatory."
    });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(userPassword)) {
    res.render("pro-auth/signup.hbs", {
      errorMessage:
        "Password must contain at least: 6 characters, one number, one lowercase letter and one uppercase letter."
    });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(userPassword, salt))
    .then((hashedPassword) => {
      return Pro.create({
        username,
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        occupation,
      }).then((userFromDB) => {
        res.redirect("/pro-login");
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.render("pro-auth/signup.hbs", {
          errorMessage: "Email/Username already in use. Please try again."
        });
      } else if (err instanceof mongoose.Error.ValidationError) {
        res.render("pro-auth/signup.hbs", { errorMessage: err.message });
      } else {
        console.log("Error while creating a user:", err);
      }
    });
});


////////// CLIENT LOGIN //////////

// Login form
router.get("/pro-login", (req, res, next) => {
  res.render("pro-auth/login.hbs");
});

// Login
router.post("/pro-login", (req, res, next) => {
  const { email, userPassword } = req.body;

  if (!email || !userPassword) {
    res.render("client-auth/login.hbs", {
      errorMessage: "All fields are mandatory. Please provide email and password."
    });
    return;
  }

  Pro.findOne({ email })
    .then((responseFromDB) => {

      if (!responseFromDB) {
        res.render("pro-auth/login.hbs", { errorMessage: "Email not found. Please try again." });
      } else if (bcryptjs.compareSync(userPassword, responseFromDB.passwordHash)) {

        req.session.currentPro = responseFromDB;


        res.redirect("/dashboard");
      } else {
        res.render("pro-auth/login.hbs", { errorMessage: "Incorrect password." });
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