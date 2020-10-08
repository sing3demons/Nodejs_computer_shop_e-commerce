const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const config = require('./config/index')
//ชำระเงิน
const stripe = require('stripe')(config.PAY_STRIPE);

//router
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const categoryRouter = require('./routes/category');
const shopRouter = require('./routes/shop');

const app = express();

app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});
//  apply to all requests
app.use(limiter);
app.use(helmet());

// connect mongodb
mongoose.connect(config.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name: 'sessionId',
  secret: config.SECRET_KEY,
  saveUninitialized: false, // don't create sessions for not logged in users
  resave: false, //don't save session if unmodified

  // Where to store session data
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 1 * 24 * 60 * 60 // = 14 days. ttl means "time to live" (expiration in seconds)
  }),
}));

// Passport Config
require('./middleware/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
})

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/category', categoryRouter)
app.use('/shop', shopRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//function จำกัดตัวอักษร ใช้แสดงรายละเอียด
app.locals.descriptionText = (text, length) => {
  return text.substring(0, length)
}

app.locals.formatNumber = (number) => {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

app.post('/payment', (req, res) => {
  const token = req.body.stripeToken
  const amount = req.body.amount
  const charge = stripe.charges.create({
    amount: amount,
    currency: "thb",
    source: token
  }, (err, charge) => {
    if (err) throw err
  })
  req.session.destroy()
  res.redirect('/')
})
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === config.NODE_ENV ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;