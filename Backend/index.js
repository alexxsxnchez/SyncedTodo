'use strict';

const express = require('express');
const router = require('./router.js');
const session = require('express-session'); //client-sessions
const uuid = require('uuid').v4;
const helmet = require('helmet');
const dbConnection = require('./db.js');

const app = express();

const port = process.env.PORT || 8000;

app.use(helmet());

app.use(session({
	genid: () => {
		return uuid(); // use UUIDs for session IDs
	},
	name: 'bucky',
	secret: 'a secret', // TODO: update to good secret
	//store: // TODO: put into redis or mongo store
	resave: false,
	//maxAge: 24 * 60 * 60 * 1000,

	saveUninitialized: false,
	cookie: {
		secure: false, // TODO: add https
		//sameSite: 'strict', //<-- causes issue (at least in postman) when set to lax or strict
		httpOnly: true
	}
}));

app.use(express.json());

app.use('/', router);

dbConnection.connect().then(() => {
	app.listen(port, () => {
		console.log(`listening on port ${port}`);
	});
}).catch((err) => {
	console.error(err);
});
