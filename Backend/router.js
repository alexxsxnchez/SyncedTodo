'use strict';

const express = require('express');
const router = express.Router();
const authService = require('./authService.js');

router.use((req, _, next) => {
	console.log(`req.sessionID (auto set):\t${req.sessionID}`);
	console.log(`req.session.id (auto set):\t${req.session.id}`);
	console.log(`req.session.user (manually set): ${req.session.user}`);
	next();
});

router.post('/signup', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	const name = req.body.name;
	// TODO: validation?
	try {
		await authService.addUser(username, password, name);
		req.session.user = username; // setting user saves session to store
		console.log(`setting username in session to ${username}`);
		res.end();
	} catch (err) {
		// do switch on error code
		res.status(401).send('Username or/and password not valid.');
	}
});

router.post('/login', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	if(req.session.user) {
		console.log(`already a session with ${req.session.user}`);
		return res.status(200).end('already logged in on this device!');
	}
	try {
		await authService.validateCredentials(username, password);
		req.session.user = username; // setting user saves session to store
		console.log(`logging in with ${username}...`);
		res.end();
	} catch (err) {
		console.log('Username or/and password is/are incorrect.');
		res.status(401).send('Username or/and password is/are incorrect.');
	}
});

router.post('/logout', (req, res) => {
	if(req.session.user) {
		console.log('logging out');
		req.session.destroy(); // destroy session deletes from store
	} else {
		console.log('not even logged in!');
	}
	res.end();
});

router.all('/health', async (_, res) => {
	const users = await authService.health();
	res.set('Content-Type', 'text/json');
	res.status(200).json(users);
});

router.use((req, res, next) => {
	if(req.session && req.session.user) {
		req.locals = {
			username: req.session.user
		};
		next();
	} else {
		res.status(401).end();
	}
});

router.get('/', async (req, res) => {
	try {
		const username = req.locals.username;
		const user = await authService.getUser(username);
		res.set('Content-Type', 'text/plain');
		res.status(200).send(`Hello ${user.name} (must be logged in to see this)`);
	} catch (err) {
		console.log(err);
		res.status(401).end();
	}
});

router.get('/user', async (req, res) => {
	try {
		const username = req.locals.username;
		const user = await authService.getUser(username);
		res.set('Content-Type', 'text/json');
		res.status(200).json(user);
	} catch (err) {
		res.status(401).send('Invalid session');
	}
});

router.use((_, res) => {
	res.status(404).end();
});

module.exports = router;
