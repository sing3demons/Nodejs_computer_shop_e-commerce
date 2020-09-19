const User = require('../models/user');
const { validationResult } = require('express-validator');
const Config = require("../config/index");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

//@GET register
exports.index = (req, res, next) => {
  res.render('register');
}

//@POST register
exports.register = (req, res, next) => {
  const result = validationResult(req);
  const errors = result.errors;
  //Validation Data
  if (!result.isEmpty()) {
    //Return error to views
    res.render('register', {
      errors: errors
    })
  } else {
    //Insert  Data
    const { name, password, email, fullName, numberPhone,
      addressInput, subdistrict, district, province, postal_code } = req.body;
    const newUser = new User({
      name: name,
      password: password,
      email: email,
      fullName: fullName,
      numberPhone: numberPhone,
      addressInput: addressInput,
      subdistrict: subdistrict,
      district: district,
      province: province,
      postal_code: postal_code
    });
    newUser.save();
    console.log(newUser);
    res.location('/users/login');
    res.redirect('/users/login');
  }
}

//@POST Login
exports.getLogin = (req, res) => {
  // req.flash("", "ลงชื่อเข้าใช้เรียบร้อยแล้ว");
  res.redirect('/');
}

exports.getUpdateUser =async (req, res, next) => {
  const {id} = req.body;
  const user = await User.findById(id)
  console.log(user);
  res.render('editUser');
}

/*@GET /users/forgot */
exports.getForgotPassword = async (req, res, next) => {
  res.render('forgot-password');
}

/*@POST /users/forgot */
exports.forgotPassword = async (req, res, next) => {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: Config.GMAIL,
          pass: Config.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: Config.GMAIL,
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
}

/*@GET /users/reset */
exports.getResetPassword = (req, res, next) => {
//
User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired.');
    return res.redirect('/forgot');
  }
  res.render('reset', {token: req.params.token});
});
}

/*@POST /users/reset */
exports.resetPassword = (req, res, next) => {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: Config.GMAIL,
          pass: Config.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: Config.GMAIL,
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
}

exports.updateUser = async (req, res, next) => {
  const {id, username, email, fullName, numberPhone, addressInput, subdistrict, district, province, postal_code} = req.body;
  const user = await User.findById(id);
  user.name = username,
  user.email = email,
  user.fullName = fullName,
  user.numberPhone = numberPhone,
  user.addressInput = addressInput,
  user.subdistrict = subdistrict,
  user.district = district,
  user.province = province,
  user.postal_code = postal_code
  await user.save()
  console.log(user);
  res.redirect('/')
}

/* @GET Admin users/admin */
exports.admin = async (req, res, next) => {
  const user = await User.find();
  res.render('admin', {users: user})
}

/* @GET Admin users/admin/admin-user */
exports.getAdminManagementUser = async (req, res, next) => {
  const role = 'member'
  const user = await User.find().where('role').eq(role);
    // res.status(200).json({
  //   user
  // })
  res.render('admin-user', {users: user})
}

/* @POST Admin users/admin/admin-user */
exports.adminManagementUserAndDelete = async (req, res, next) => {
  const {id} = req.body;
  const user = await User.findByIdAndDelete(id)
    // res.status(200).json({
  //   user
  // })
  console.log(id);
  res.redirect('users/admin/admin-user')
}