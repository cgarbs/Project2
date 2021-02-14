require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app = express();

// require database configuration
require('./configs/db.config');
require("./configs/session.config")(app);

const bindProToLocals = require("./configs/pro-locals.config");
app.use(bindProToLocals);

const bindClientToLocals = require("./configs/client-locals.config");
app.use(bindClientToLocals);

// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
app.locals.title = 'Ancheta';

// const index = require('./routes/index');
// app.use('/', index);
//      |  |  |
//      V  V  V
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/client.routes'));
app.use('/', require('./routes/professional.routes'));
app.use('/', require('./routes/proAuth.routes'));
app.use('/', require('./routes/clientAuth.routes'));

module.exports = app;
