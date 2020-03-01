'use strict';

/*
- Everytime client interacts with server a new sessionID is made for that api call.
- So on login and signup, that sessionID is simply recorded

*/


const database = {
	userTable: {},
	sessionTable: {}
};

async function addUser(username, password, name, sessionId) {
	console.log('adding user...');
	if(username && password && name) {
		if(username in database.userTable) {
			// user already exists
			console.log('user already exists');
			throw new Error('user already exists');
		} else {
			const hash = password; // TODO create hash
			const user = {
				name: name,
				username: username,
				hash: hash
			};
			console.log('created user');
			database.userTable[username] = user;
			database.sessionTable[sessionId] = username;
			console.log(`in addUser: ${sessionId}`);
		}
	} else {
		// bad request
		console.log('username and/or password and/or name are empty');
		throw new Error('malformed request');
	}
}

async function removeSession(authId) {
	if(authId && database.sessionTable[authId]) {
		delete database.sessionTable[authId];
	} else {
		throw new Error('session doesn\'t exist');
	}
}

async function validateCredentials(username, password, authId) {
	if(username && password) {
		const hash = password; // todo hash
		try {
			const user = await getUser(username);
			if (user.hash !== hash) {
				throw new Error('Username or/and password is/are incorrect.');
			}
			database.sessionTable[authId] = username;
		} catch (err) {
			throw err;
		}
	} else {
		throw new Error('Username or/and password is/are incorrect.');
	}
}

async function auth(req) {
	if(req.session && req.session.user) { 
		return getUserId(req.session.user);
	} else {
		console.log('session doesn\'t exist');
		throw new Error('session doesn\'t exist');
	}
}

async function getUser(username) {
	if(database.userTable[username]) {
		return database.userTable[username];
	} else {
		throw new Error('username and/or password incorrect');
	}
}

async function getUserId(authId) {
	if(database.sessionTable[authId]) {
		return database.sessionTable[authId];
	} else {
		console.log('no user id: ' + authId);
		throw new Error('sessionId invalid');
	}
}

function health() {
	return database;
}
    
module.exports = { validateCredentials, auth, removeSession, addUser, getUser, getUserId, health };
