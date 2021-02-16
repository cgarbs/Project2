const express = require('express');
const router = express.Router();

const Job = require('../models/Job.model');
const Inquiry = require('../models/Inquiry.model');
const Client = require('../models/Client.model');


// Creating new inquiry
router.get('/inquire', (req, res, next) => {
  if(!req.session.currentClient) {
    res.redirect('/client-login')
  }
  Job.find()
  .then(jobsFromDB => {
    res.render('client/make-an-inquiry.hbs', { jobsFromDB })
  })
  .catch(err => console.log(`Error occurred while retrieving jobs: ${err}. `))
});

router.post('/create-inquiry', (req, res, next) => {
  const { clientName, category, when, where, description } = req.body;
  const info = req.body;
  Inquiry.create({ clientName, category, when, where, description })
  .then(res.render('client/inquiry-sent.hbs', { info }))
  .catch(err => console.log(`Error occurred while creating inquiry: ${err}. `))
});

// Display made inquiries
router.get('/my-inquiries', (req, res, next) => {
  if(!req.session.currentClient) {
    res.redirect('/client-login')
  }
  Inquiry.find()
  .populate('category')
  .then(inquiriesFromDB => {
    // console.log(inquiriesFromDB);
    res.render('client/my-inquiries.hbs', { inquiriesFromDB })
  })
  .catch(err => console.log(`Error occurred while retrieving inquiries: ${err}. `))
});


// Delete made inquiry
router.post('/inquiry/:id/delete', (req, res, next) => {
  Inquiry.findByIdAndRemove(req.params.id)
  .then(() =>
    res.redirect('/my-inquiries'))
    .catch(err => console.log(`Error occurred while deleting inquiry: ${err}.`))
});


// Edit made inquiries
router.get('/inquiry/:id/edit', (req, res, next) => {
  if(!req.session.currentClient) {
    res.redirect('/client-login')
  }
  Inquiry.findById(req.params.id)
  .then(inquiryToUpdate => {
    console.log(inquiryToUpdate);
    res.render('client/inquiry-update-form.hbs', { inquiryToUpdate })
  })
  .catch(err => console.log(`Error occurred while retrieving update form: ${err}. `))
});

router.post('/inquiry/:id/update', (req, res, next) => {
  const { when, where, description } = req.body;
  Inquiry.findByIdAndUpdate(req.params.id, { when, where, description }, {new: true})
  .then(() =>
      res.redirect(`/inquiry/${req.params.id}`))
      .catch(err => `Error occured while updating inquiry: ${err}`)
  });


// Display inquiry details
router.get('/inquiry/:id', (req, res, next) => {
  if(!req.session.currentClient) {
    res.redirect('/client-login')
  }
  Inquiry.findById(req.params.id)
  .populate('category')
  .then(inquiryFromDB =>
    res.render('client/inquiry-details.hbs', { inquiryFromDB }))
    .catch(err => console.log(`Error occurred while rendering inquiry details: ${err}.`))
});

// Display client profile
router.get('/my-profile', (req, res, next) => {
  if(!req.session.currentClient) {
    res.redirect('/client-login')
  }
  Client.findById(req.session.currentClient._id)
  .then(profileFromDB => {
    console.log(profileFromDB)
    res.render('client/profile.hbs', { profileFromDB })
  })
    .catch(err => console.log(`Error occurred while rendering profile details: ${err}.`))
});






module.exports = router;
