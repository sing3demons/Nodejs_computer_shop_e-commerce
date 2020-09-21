const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// module.exports enables app.js to use require('./config/passport')(passport)
module.exports = function(passport) {
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',    
        passwordField : 'password', 
        passReqToCallback : true 
    }, (req, email, password, done) => {
        
        // we lookup a user with a matching 'email'
        User.findOne({email: email}).then(function(user) {
            if (!user) {
                // this means fail the login
                // const error = new Error('error');
                // throw error;
                return done(null, false);
            }else{
              return done(null, user);
          }
        
            // check password validity
            if (!user.checkPassword(password)) {
                // this means fail login
                return done(null, false);
            }

            // otherwise, pass user object with no errors
            return done(null, user)    
        }).catch(function(err) {done(err, false)});
    }));

    // LOCAL SIGNUP 
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true 
    }, function(req, email, password, done) {

        // if the user is already logged in:
        if (req.user) {
            // just pass back his data
            return done(null, req.user);
        }

        // we check if no other user has already taken this email
        User.findOne({email : email}).then(function(user) {

            // check if a user found with this email
            if (user) {
                // fail the signup
                return done(null, false);
            }

            // otherwise store user info in the Database
            new User({
                email: email,
                // hash/encrypt password before storing it in the database
                password: User.generateHash(password),
                nickname: req.body.nickname,
                age: req.body.age,
                role: req.body.role
            }).save(function(err, savedUser) {
                if (err) {
                    return done(err, false)
                }
                // Success. Pass back savedUser
                return done(null, savedUser);
            })
        }).catch(function(err) {done(err, false)});
    }));

    // passport session setup 
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};

module.exports.isLogin = passport.authenticate('local', {
	failureRedirect : '/users/login',
	failureFlash : false // allow flash messages
})