'use strict';

import UserModel from '../models/user'
import jwt from 'jwt-simple'
const passport = require('passport')
const cfg = require('../config.json')

/**
 * Logout Route
 * path: /logout
 ******************** */

let express = require('express');
let router = express.Router();

router.post('/', (req, res) => {
	req.logout();
	res.redirect('/');
})

module.exports = router;