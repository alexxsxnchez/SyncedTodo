'use strict';

const express = require('express');
const router = express.Router();
const authService = require('./authService.js');

router.use((req, res, next) => {
	console.log(`SESSION ID: ${req.sessionID}`);
	console.log(`SESSION.USER: ${req.session.user}`);
	next();
});

router.post('/signup', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const name = req.body.name;
	try {
		await authService.addUser(username, password, name, req.sessionID);
		req.session.user = req.sessionID;
		console.log(`setting auth id to ${req.session.user}`);
		res.end();
	} catch (err) {
		// do switch on error code
		res.status(401).send('Username or/and password not valid.');
	}
});

router.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if(req.session && req.session.user) {
		console.log(`already a session with ${req.session.user}`);
		return res.end();
	}
	try {
		await authService.validateCredentials(username, password, req.sessionID);
		req.session.user = req.sessionID;
		console.log(`logging in with ${req.session.user}...`);
		res.end();
	} catch (err) {
		console.log('Username or/and password is/are incorrect.');
		res.status(401);
		res.send('Username or/and password is/are incorrect.');
	}
});

router.post('/logout', async (req, res) => {
	try {
		await authService.removeSession(req.session.user);
		console.log('logging out');
	} catch (err) {
		console.log('not even logged in!');
	}
	req.session.destroy();
	res.end();
});

router.all('/health', (req, res) => {
	res.send(authService.health());
});

// all other routes need session
router.use(async (req, res, next) => {
	console.log('in auth');
	try {
		await authService.auth(req);
		next();
	} catch (err) {
		res.status(401).end();
	}
});

router.get('/', async (req, res) => {
	const authId = req.session.user;
	console.log(`authId: ${authId}`);
	try {
		const userId = await authService.getUserId(authId);
		const user = await authService.getUser(userId);
		res.set('Content-Type', 'text/plain');
		res.status(200).send(`Hello ${user.name} (must be logged in to see this)`);
	} catch (err) {
		console.log(err);
		res.status(401).end();
	}
});

router.get('/user', async (req, res) => {
	const authId = req.session.user;
	try {
		const userId = await authService.getUserId(authId);
		const user = await authService.getUser(userId);
		res.set('Content-Type', 'text/json');
		res.status(200).json(user);
	} catch (err) {
		res.status(401).send('Invalid session');
	}
});

router.use((req, res) => {
	res.status(404).end();
});

module.exports = router;
