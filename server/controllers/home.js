'use strict';

/**
* Home Route
* path: /
******************** */

let express    = require('express');
let router     = express.Router();

router.get('/', (req, res) => {
	res.render('home', {user: req.user});
});

module.exports = router;