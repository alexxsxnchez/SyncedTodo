'use strict';

const express = require('express');
const router = require('./router.js');
const session = require('express-session'); //client-sessions
const uuid = require('uuid').v4;
const helmet = require('helmet');
const dbConnection = require('./db.js');
const config = require('./config.js');

const app = express();

const port = process.env.PORT || 8000;

app.use(helmet());

app.use(session({
	genid: () => {
		return uuid(); // use UUIDs for session IDs
	},
	name: config.session.name,
	secret: config.session.secret, // TODO: update to good secret
	//store: // TODO: put into redis or mongo store
	resave: false, // depends on what type of store is used (research it: https://www.npmjs.com/package/express-session#resave)
	//maxAge: 24 * 60 * 60 * 1000, 1 day

	/* saveUninitialized:
	should we AUTOMATICALLY save a session to the store (set above^) the first time it
	initialized. When a session is saved to the store, the
	req.session.id/req.sessionId will stay the same value in between requests.
	Might not want to be used to save server storage. Might want to opt to manually call
	.save() on session store
	*/
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
