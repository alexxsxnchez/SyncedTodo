'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router.js');
const session = require('express-session'); //client-sessions
const uuid = require('uuid/v4');
const helmet = require('helmet');

const app = express();

const port = 8000;

app.use(helmet());

app.use(session({
	genid: function() {
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

app.use(bodyParser.json());

app.use('/', router);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
