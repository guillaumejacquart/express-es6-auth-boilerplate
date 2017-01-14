import express from 'express';

export default ({ config, db }) => {

	let app = express()

	// respond with "hello world" when a GET request is made to the homepage
	app.get('/', function (req, res) {
		console.log(req.user);
		res.json(req.user);
	})
	
	return app;
}