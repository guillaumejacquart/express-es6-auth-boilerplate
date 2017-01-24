import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressHandlebars from 'express-handlebars';
import passport from 'passport'
import session from 'express-session'
import nedbSession from 'express-nedb-session';
import flash from 'express-flash'
import authentication from './authentication'
import mvcRoutes from './routes';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';

let app = express();
app.server = http.createServer(app);

// set handlebars as the engine for '.handlebars' extensions
app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main',
	layoutsDir: __dirname + '/views/layouts/'
}));

// set handlebars as the view engine
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// configure session
app.use(session({  
  store: new nedbSession(session)({
    filename: './session.db'
  }),
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false
}))

// initialize flash message
app.use(flash());

// initialize passportjs
app.use(passport.initialize())  
app.use(passport.session())  

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

// add static handler for client app
app.use('/app', express.static(__dirname + '/../client'));

// add static handler for assets
app.use(express.static('assets'));

let jsonParser = bodyParser.json({
	limit : config.bodyLimit
});

let urlencodedParser = bodyParser.urlencoded({ extended: false })

// connect to db
initializeDb(db => {
	
	// inject db and route in request
	app.use((req, res, next) => {
		req.db = db;
		res.locals.active = {}
		res.locals.active[req.path.substring(1) || 'home'] = true
		next();
    });
	
	// initialize passportjs middlewares
	authentication.init(db)

	// internal middleware
	app.use(middleware({ config, db }));
	
	// MVC router
	mvcRoutes.forEach(route => {
		if(route.restricted){
			app.use(route.path, passport.authenticationMiddleware(), urlencodedParser, route.handler);
		} else{			
			app.use(route.path, urlencodedParser, route.handler);
		}
	});

	// api router
	app.use('/api', passport.authenticationMiddleware(), jsonParser, api({ config, db }));
	
	// handle no route found
	app.use((req, res, next) => {
		res.status(404);
		res.render('global/404', {
			title: 'Page introuvable !',
		});
	});
	
	app.server.listen(process.env.PORT || config.port, process.env.IP || "0.0.0.0", function(){
	  var addr = app.server.address();
	  console.log("Server listening at", addr.address + ":" + addr.port);
	});
});

export default app;