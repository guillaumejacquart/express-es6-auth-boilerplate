'use strict';


const passport = require('passport')

/**
* Login Route
* path: /login
******************** */

let express    = require('express');
let router     = express.Router();

router.get('/', (req, res) => {
	res.render('login');
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
}))

module.exports = router;