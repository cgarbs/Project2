const express = require("express");
const router = express.Router();

const Job = require('../models/Job.model');
const Inquiry = require('../models/Inquiry.model');
const Pro = require("../models/Pro.model");


// Display pro dashboard
router.get('/dashboard', (req, res, next) => {
  if(!req.session.currentPro) {
    res.redirect('/pro-login')
  }
  Pro.findById(req.params.id)
  .then(profileFromDB =>
    res.render('professional/dashboard.hbs', { profileFromDB }))
    .catch(err => console.log(`Error occurred while rendering dashboard: ${err}.`))
});


// Display pro profile
router.get('/my-pro-file', (req, res, next) => {
  if(!req.session.currentPro) {
    res.redirect('/pro-login')
  }
  Pro.findById(req.session.currentPro._id)
  .populate('occupation')
  .then(profileFromDB => {
    console.log(profileFromDB);
    res.render('professional/pro-file.hbs', { profileFromDB })
  })
    .catch(err => console.log(`Error occurred while rendering profile details: ${err}.`))
});


// Display inquiries
router.get('/inquiries', (req, res, next) => {
  if(!req.session.currentPro) {
    res.redirect('/pro-login')
  }
  Inquiry.find()
  .populate('category')
  .then(inquiriesFromDB => {
    inquiriesFromDB.forEach(e => {
      e.category.forEach(i => {
        if(i._id.equals(req.session.currentPro.occupation[0])) {
          e.match = true;
        }
      })
    }) 
    res.render('professional/inquiries.hbs', { inquiriesFromDB })
  })
    .catch(err => console.log(`Error occurred while rendering inquiries: ${err}.`))
});


// Display inquiry details
router.get('/inquiry/:id/details', (req, res, next) => {
  if(!req.session.currentPro) {
    res.redirect('/pro-login')
  }
  Inquiry.findById(req.params.id)
  .populate('category')
  .then(inquiryFromDB =>
    res.render('professional/inquiry-details.hbs', { inquiryFromDB }))
    .catch(err => console.log(`Error occurred while rendering inquiry details: ${err}.`))
});


module.exports = router;

