'use strict';

import UserModel from '../models/user'
import jwt from 'jwt-simple'
const passport = require('passport')
const cfg = require('../config.json')

/**
* Auth Route
* path: /auth
******************** */

let express = require('express');
let router = express.Router();

// Facebook routes
router.get('/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/facebook/callback', passport.authenticate('facebook', {  
  successRedirect: '/profile',
  failureRedirect: '/',
}));

module.exports = router;