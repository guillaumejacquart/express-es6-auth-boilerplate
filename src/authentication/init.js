import passport from 'passport'
import LocalStrategy from 'passport-local'
import { Strategy as FacebookStrategy } from 'passport-facebook';  
import passportJWT from "passport-jwt"
import UserModel from '../models/user'
import cfg from "../config.json"

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

const authenticationMiddleware = require('./middleware')
var User;

passport.serializeUser(function (user, cb) {
  cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
  User.find(username, cb)
})

function initPassport(db) {
  User = new UserModel(db);

  passport.use(new LocalStrategy(
    function (username, password, done) {
      User.find(username, function (err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(null, false, { message: 'Oops! utilisateur inconnu.' })
        }

        User.isValid(username, password, function (err, valid) {
          if (!valid) {
            return done(null, false, { message: 'Oops! Mauvais password.' })
          }
          return done(null, user)
        })
      })
    }
  ))

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
    function (req, username, password, done) {

      User.find(username, function (err, user) {
        // if there are any errors, return the error
        if (err)
          return done(err);

        // check to see if theres already a user with that username
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        } else {
          User.create(username, password, {}, function (err, user) {
            return done(err, user);
          });
        }

      });

    }));
	
	
	let params = {
		secretOrKey: cfg.jwtSecret,
		jwtFromRequest: ExtractJwt.fromAuthHeader()
	};

  passport.use(new JwtStrategy(params, function (payload, done) {
    User.findById(payload.id, function (err, user) {
      if (user) {
        return done(null, user);
      } else {
        return done(new Error("User not found"), null);
      }
    })
  }));
  
  if(cfg.facebookAuth){	 
	  passport.use(new FacebookStrategy({  
		clientID: cfg.facebookAuth.clientID,
		clientSecret: cfg.facebookAuth.clientSecret,
		callbackURL: cfg.facebookAuth.callbackURL,
		profileFields: ['id', 'email', 'first_name', 'last_name'],
	  },
	  function(token, refreshToken, profile, done) {
		process.nextTick(function() {
		  User.findOne({ 'facebook.id': profile.id }, function(err, user) {
			if (err)
			  return done(err);
			if (user) {
			  return done(null, user);
			} else {
			  User.create(profile.id, '', {
				  facebook: {
					  id: profile.id,
					  token: token,
					  name: profile.name.givenName + ' ' + profile.name.familyName,
					  email: (profile.emails[0].value || '').toLowerCase()
				  }
			  }, function (err, user) {
				return done(err, user);
			  });
			}
		  });
		});
	  }));
  }


  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport