module.exports = (req, res, next) => {
  res.locals.clientInSession = req.session.currentClient;
  next();
};
