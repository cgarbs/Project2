const express = require("express");
const router = express.Router();

const Job = require('../models/Job.model');
const Inquiry = require('../models/Inquiry.model');
const Pro = require("../models/Pro.model");
const fileUploader = require('../configs/cloudinary.config');


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

// Edit Pro-File
router.get('/edit/:id/profile', (req, res, next) => {
  if(!req.session.currentPro) {
    res.redirect('/pro-login')
  }
  Pro.findById(req.session.currentPro._id)
  .then(profileToUpdate => {
    res.render('professional/edit-pro-file', { profileToUpdate })
  })
  .catch(err => console.log(`Error occurred while retrieving update form: ${err}. `))
});

router.post('/edit/:id/update', fileUploader.single('profilePicture'), (req, res, next) => {
  const { firstName, lastName } = req.body;
  Pro.findByIdAndUpdate(req.params.id, { firstName, lastName, profilePicture: req.file.path }, {new: true})
  .then(() => {
      res.redirect(`/my-pro-file`)})
      .catch(err => `Error occured while updating profile: ${err}`)
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

 
router.get('/my-portfoilio', (req, res, next) => {
  if(!req.session.currentPro) {
    res.redirect('/pro-login')
  }
  Pro.findById(req.session.currentPro._id)
  .then(inquiryFromDB =>
    res.render('professional/inquiry-details.hbs', { inquiryFromDB }))
    .catch(err => console.log(`Error occurred while rendering inquiry details: ${err}.`))
});

// Inquiry Response
router.get('/response-sent', (req, res, next) => {
  if(!req.session.currentPro) {
    res.redirect('/pro-login')
  }
    res.render('professional/inquiry-response.hbs')
});

// Display portfolio
router.get('/my-portfolio', (req, res, next) => {
  if(!req.session.currentPro) {
    res.redirect('/pro-login')
  }
  Pro.findById(req.session.currentPro._id)
  .populate('portfolio')
  .then(profileFromDB => {
    res.render('professional/portfolio.hbs', { profileFromDB })
  })
    .catch(err => console.log(`Error occurred while rendering portfolio details: ${err}.`))
});

// router.post('/portfolio/:id', fileUploader.single('profilePicture'), (req, res, next) => {
//   Pro.findByIdAndUpdate(req.params.id, { portfolio: req.file.path }, {new: true})
//   .then(profileFromDB => {
//     profileFromDB.portfolio.push(req.file.path);
//       res.redirect(`/my-portfolio`)})
//       .catch(err => `Error occured while updating portfolio: ${err}`)
//   });


module.exports = router;

