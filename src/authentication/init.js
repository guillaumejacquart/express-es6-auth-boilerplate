import passport from 'passport'
import LocalStrategy from 'passport-local'
import UserModel from '../models/user'

const authenticationMiddleware = require('./middleware')
var User;

passport.serializeUser(function (user, cb) {
	cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
	User.find(username, cb)
})

function initPassport (db) {
  User = new UserModel(db);
  
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.find(username, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false)
        }
		
		User.isValid(username, password, function(err, valid){
			if (!valid) {
			  return done(null, false)
			}
			return done(null, user)
		})
      })
    }
  ))
  
  passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
		
        User.find(username, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that username
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {
				User.create(username, password, function(err, user){
                    return done(err, user);
				});
            }

        }); 

    }));


  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport