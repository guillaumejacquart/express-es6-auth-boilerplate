import express from 'express';
var todos = [];

export default ({ config, db }) => {

	let app = express()

	// respond with "hello world" when a GET request is made to the homepage
	app.get('/', function (req, res) {
		res.json(req.user);
	})

	// respond with "hello world" when a GET request is made to the homepage
	app.get('/todos', function (req, res) {
		res.json(todos || []);
	})

	// respond with "hello world" when a GET request is made to the homepage
	app.post('/todos', function (req, res) {
		console.log(req.body);
		todos = req.body;
		res.json(todos);
	})
	
	return app;
}