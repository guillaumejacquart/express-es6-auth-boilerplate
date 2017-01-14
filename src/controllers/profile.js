'use strict';

import UserModel from '../models/user'
const passport = require('passport')

/**
* Profile Route
* path: /profile
******************** */

let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	res.render('profile');
});

module.exports = router;