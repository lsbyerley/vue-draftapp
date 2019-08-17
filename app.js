//REFERENCE
//2018 380.l.664621
//2019 390.l.887953

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieSession = require('cookie-session');
const compression = require("compression");
const passport = require('passport');
const YahooFantasy = require('yahoo-fantasy');
const helmet = require('helmet');
const crossdomain = require('helmet-crossdomain');
const config = require('./config.js')
const APP_KEY = process.env.APP_KEY || config.APP_KEY;
const APP_SECRET = process.env.APP_SECRET || config.APP_SECRET;

const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 80;

// view engine setup
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'pug');

// security settings
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.ieNoOpen());
app.use(crossdomain());
app.use(helmet.hidePoweredBy());

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve('./public')));
app.use(cookieSession({
  name: 'yfsdraftapp',
  secret: 'gobucsgo',
  maxAge: 1 * 60 * 60 * 1000, // 1 hour
}))
app.use(passport.initialize());
app.use(passport.session());

app.locals.env = process.env.NODE_ENV
global.yf = new YahooFantasy(APP_KEY, APP_SECRET);
global.config = config
global.__basedir = __dirname;

const api = require('./server/api');
const routes = require('./server/routes');
require('./server/routes/config/passport')(passport, config)

// Use API Routes
app.use('/api', api);

// Use all routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  return next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err

  // render the error page
  res.status(err.status || 500);
  return res.render('error');
});

async function start() {
  // Listen the server
  app.listen(port, host);
  console.log("Server listening on http://" + host + ":" + port); // eslint-disable-line no-console
}
start();
