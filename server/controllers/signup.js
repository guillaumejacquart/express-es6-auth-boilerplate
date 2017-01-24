'use strict';


const passport = require('passport')

/**
 * Signup Route
 * path: /signup
 ******************** */

let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	res.render('signup');
});

router.post('/', passport.authenticate('local-signup', {
	successRedirect: '/', // redirect to the secure profile section
	failureRedirect: '/signup', // redirect back to the signup page if there is an error
	failureFlash: true // allow flash messages
}));

module.exports = router;