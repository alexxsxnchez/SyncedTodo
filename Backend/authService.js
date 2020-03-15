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

async function addUser(username, password, name, sessionId) {
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
				await addSession(sessionId, username);
				console.log(`added session: ${sessionId}`);
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

async function removeSession(sessionId) {
	if(sessionId) {
		try {
			await db().collection('sessions').deleteOne({sessionId});
			console.log(`session with id ${sessionId} deleted`);
		} catch(err) {
			console.error(err);
			throw new Error('session couldn\'t be deleted');
		}
	} else {
		throw new Error('session doesn\'t exist');
	}
}

async function validateAndAddSession(username, password, sessionId) {
	if(username && password) {
		const hash = password; // todo hash
		try {
			const user = await getUser(username);
			if (user.hash !== hash) {
				throw new Error('Username or/and password is/are incorrect.');
			}
			await addSession(sessionId, username);

		} catch (err) {
			throw err;
		}
	} else {
		throw new Error('Username or/and password is/are incorrect.');
	}
}

async function addSession(sessionId, username) {
	// having a max number of sessions per user prevents a hacker changing the client such that
	// the same device can have an unlimited number of sessions. (normal client code would have
	// the session be stored in a cookie that is saved on the client to be reused)
	const maxSessionsPerUser = 5;
	const count = await db().collection('sessions').countDocuments({username}, {limit: maxSessionsPerUser});
	if(count >= maxSessionsPerUser) {
		try {
			const result = await db().collection('sessions').findOneAndDelete( { username }, { sort: {'created_at': 1} } );
			if(!result) {
				throw new Error('Should have deleted an item');
			}
		} catch(err) {
			console.error(err);
		}
	}
	const session = {
		sessionId,
		username,
		created_at: Date.now()
	};
	try {
		await db().collection('sessions').insertOne(session);
	} catch(err) {
		console.error(err);
	}
}

async function getUsernameForSession(sessionId) {
	try {
		const session = await db().collection('sessions').findOne({sessionId});
		if(session) {
			return session.username;
		} else {
			console.error(`no sessionId: ${sessionId}`);
		}
	} catch(err) {
		console.error(err);
	}
	throw new Error('sessionId invalid');
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
    
module.exports = { validateAndAddSession, removeSession, addUser, getUser, getUsernameForSession, health };
