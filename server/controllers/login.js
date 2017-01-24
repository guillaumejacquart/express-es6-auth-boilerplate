'use strict';

import UserModel from '../models/user'
import jwt from 'jwt-simple'
const passport = require('passport')
const cfg = require('../config.json')

/**
* Login Route
* path: /login
******************** */

let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
	res.render('login', { error: req.flash('error') });
});

router.post('/', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login',
	failureFlash: true
}))

router.post("/token", function (req, res) {
    var User = new UserModel(req.db);
	if (req.body.username && req.body.password) {
		var username = req.body.username;
		var password = req.body.password;
		User.find(username, function (err, user) {
			if (err) {
				throw err;
			}
			if (user) {
				User.isValid(username, password, function (err, valid) {
					if(err){
						throw err;
					}
					
					if (valid) {
						var payload = {
							id: user._id,
							username: user.username
						};
						var token = jwt.encode(payload, cfg.jwtSecret);
						return res.json({
							token: token
						});
					}
					res.sendStatus(401);
				})
			} else {
				res.sendStatus(401);
			}
		})
	} else {
		res.sendStatus(401);
	}
});

module.exports = router;