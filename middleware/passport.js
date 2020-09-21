const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// module.exports enables app.js to use require('./config/passport')(passport)
module.exports = (passport) => {
    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
        session: false
    }, async (req, email, password, done) => {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(new Error('ไม่พบบัญชีผู้ใช้นี้'), null);
            } 

            if (!user.checkPassword(password)) 
            { return done(new Error('ไม่พบรหัสผู้ใช้นี้'), null); }


            return done(null, user);

        } catch (error) {
            done(error);
        }
    }));

    // passport session setup 
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};

module.exports.isLogin = passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: false // allow flash messages
})