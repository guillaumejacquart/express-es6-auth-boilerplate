import express from 'express';

export default ({ config, db }) => {

	let app = express()

	// respond with "hello world" when a GET request is made to the homepage
	app.get('/', function (req, res) {
		db.insert([{ ip:  req.ip }], function (err, newDoc) {
			db.find({}, function (err, docs) {
				res.json(docs);
			});
		});
	})
	
	return app;
}