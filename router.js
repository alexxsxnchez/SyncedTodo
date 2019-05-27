'use strict';

const express = require('express');
const router = express.Router();
const authService = require('./authService.js');

router.post('/signup', function(req, res) {
	const username = req.body.username;
	const password = req.body.password;

	authService.addUser(username, password, req.sessionID, (err) => {
		if(err) {
			res.status(401).send('Username or/and password not valid.');
		} else {
			req.session.user = req.sessionID;
			console.log(`setting auth id to ${req.sessionID}`);
			res.end();
		}
	});
});

router.post('/login', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if(req.session && req.session.user) {
		console.log(`already a session with ${req.session.user}`);
		return res.end();
	}
	authService.validateCredentials(username, password, req.sessionID, (err) => {
		if(err) {
			res.status(401);
			res.send('Username or/and password is/are incorrect.');
		} else {
			req.session.user = req.sessionID;
			console.log(`logging in with ${req.sessionID}...`);
			res.end();
		}
	}); 
});

router.post('/logout', (req, res) => {
	authService.removeSession(req.session.user, (err) => {
		if(err) {
			console.log('not even logged in!');
		} else {
			console.log('logging out');
		}
		req.session.destroy();
		res.end();
	});
});

router.all('/health', (req, res) => {
	res.send(authService.health());
});

// all other routes need session
router.use((req, res, next) => {
	console.log('in auth');
	authService.auth(req, (err/*, userId*/) => {
		if(err) {
			res.status(401).end();
		} else {
			next();
		}
	});
});

router.get('/', (req, res) => {
	const userId = req.session.user;
	const sessionId = req.sessionID;
	console.log(`userId: ${userId}`);
	console.log(`sessionId: ${sessionId}`);
	res.set('Content-Type', 'text/plain');
	res.status(200).send('hello world (must be logged in to see this)');

});

router.use((req, res) => {
	res.status(404).end();
});

module.exports = router;
