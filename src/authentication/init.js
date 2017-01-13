import passport from 'passport'
import LocalStrategy from 'passport-local'
import UserModel from '../models/user'

const authenticationMiddleware = require('./middleware')

passport.serializeUser(function (user, cb) {
	cb(null, user.username)
})

passport.deserializeUser(function (username, cb) {
	User.find(username, cb)
})

function initPassport (db) {
  const User = new UserModel(db);
  
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

  passport.authenticationMiddleware = authenticationMiddleware
}

module.exports = initPassport