var passport = require('passport')

function authenticationMiddleware() {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      res.locals.user = req.user;
      return next()
    }

    if (req.headers['authorization']) {
      return passport.authenticate('jwt', { session: false }, function (err, user) {
        if (user) {
          req.user = user;
          res.locals.user = user
          return next()
        } else{
          return res.sendStatus(401);
        }
      })(req, res, next);
    }

    res.redirect('/login');
  }
}

module.exports = authenticationMiddleware