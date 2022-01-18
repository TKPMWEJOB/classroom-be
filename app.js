const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./components/users/usersRouter');
const coursesRouter = require('./components/courses/coursesRouter');
const authRouter = require('./components/auth/authRouter');
const auth = require('./components/auth/passport/auth');
const studentRecordsRouter = require('./components/studentRecords/studentRecordsRouter');
const notificationRouter = require('./components/notification/notificationRouter');
const adminRouter = require('./components/admin/adminRouter');

const sequelize = require('./components/dal/db');
const { applyExtraSetup } = require('./components/dal/db_relationship');
applyExtraSetup();
sequelize.sync();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors({ origin: [
  process.env.CLIENT_ADDRESS,
  process.env.ADMIN_CLIENT_ADDRESS
], credentials: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

auth(app);

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/notification', notificationRouter);
app.use('/courses', coursesRouter);
app.use('/courses', studentRecordsRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
