module.exports = (req, res, next) => {
  res.locals.proInSession = req.session.currentPro;
  next();
};
