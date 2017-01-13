'use strict';


const passport = require('passport')

/**
* Signup Route
* path: /signup
******************** */

let express    = require('express');
let router     = express.Router();

router.get('/', (req, res) => {
	res.render('signup');
});

router.post('/', (req, res) => {
	res.render('signup');
});

module.exports = router;