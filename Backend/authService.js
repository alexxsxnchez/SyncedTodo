'use strict';

/*
- Everytime client interacts with server a new sessionID is made for that api call.
- So on login and signup, that sessionID is simply recorded


- Instead of storing a table of sessionIds that map to usernames with sessionsIds
stored in cookie/session, could just store usernames in cookie/session. However,
this removes the ability for us to force a user to logout from server side. Can no
longer simply remove a sessionId entry from session table to force log out.

Could use Mongo store in express-sessions which I think does the storing of session
ids in mongo for you in a db, and collection of your choosing. This would reduce code
here, and still let you foribly remove session ids from db to force logout.
*/

const db = require('./db.js').db;

async function addUser(username, password, name) {
	console.log('adding user...');
	if(username && password && name) {
		const result = await db().collection('users').findOne({ username });
		if(result) {
			// user already exists
			console.log('user already exists');
			throw new Error('user already exists');
		} else {
			const hash = password; // TODO create hash
			const user = {
				name,
				username,
				hash
			};
			try {
				await db().collection('users').insertOne(user);
				console.log(`added user: ${username}`);
			} catch (err) {
				console.error(err);
				throw new Error('Could not add user to database.');
			}
		}
	} else {
		// bad request
		console.log('username and/or password and/or name are empty');
		throw new Error('malformed request');
	}
}

async function validateCredentials(username, password) {
	if(username && password) {
		const hash = password; // todo hash
		try {
			const user = await getUser(username);
			if (user.hash !== hash) {
				throw new Error('Username or/and password is/are incorrect.');
			}
		} catch (err) {
			throw err;
		}
	} else {
		throw new Error('Username or/and password is/are incorrect.');
	}
}

async function getUser(username) {
	try {
		const user = await db().collection('users').findOne({username});
		if(user) {
			return user;
		}
	} catch(err) {
		console.error(err);
	}
	throw new Error('username and/or password incorrect');
}

async function health(limit = 10) {
	const cursor = await db().collection('users').find().limit(limit);
	return cursor.toArray();
}
    
module.exports = { validateCredentials, addUser, getUser, health };
