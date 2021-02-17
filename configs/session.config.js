const session = require("express-session");

const MongoStore = require("connect-mongo")(session);

const mongoose = require("mongoose");

module.exports = (app) => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: false,
      cookie: {
        maxAge: 6000000 // (10 Minute)
      },
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // (1 Day)
      })
    })
  );
};
