const express = require('express');
const router = express.Router();

const Job = require('../models/Job.model');

/* GET home page */
router.get("/", (req, res, next) => res.render("index"));

module.exports = router;


// , { user: req.session.currentUser }