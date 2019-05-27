'use strict';

const database = {
	userTable: {},
	sessionTable: {}
};

function addUser(username, password, authId, callback) {
	console.log('adding user...');
	if(username && password && !(username in database.userTable)) {
		const hash = password; // TODO create hash
		const user = {
			'username': username,
			'hash': hash
		};
		console.log('created user');
		database.userTable[username] = user;
		database.sessionTable[authId] = username;
		console.log(`in addUser: ${authId}`);
		callback(null);
	} else {
		console.log('user already signed up');        
		callback(new Error('username or/and password not valid'));
	}
}

function removeSession(authId, callback) {
	if(authId && database.sessionTable[authId]) {
		delete database.sessionTable[authId];
		callback(null);
	} else {
		callback(new Error());
	}
}

function validateCredentials(username, password, authId, callback) {
	if(username && password) {
		const hash = password; // todo hash
		getUser(username, (err, user) => {
			if(err || user.hash !== hash) {
				callback(new Error('Username or/and password is/are incorrect.'));
			} else {
				database.sessionTable[authId] = username;
				callback(null);
			}
		});
	} else {
		callback(new Error('Username or/and password is/are incorrect.'), null);
	}
}

function auth(req, callback) {
	if(req.session && req.session.user) { 
		getUserId(req.session.user, callback);
	} else {
		console.log('session doesn\'t exist');
		callback(new Error('session doesn\'t exist'), null);
	}
}

function getUser(username, callback) {
	if(database.userTable[username]) {
		callback(null, database.userTable[username]);
	} else {
		callback(new Error('username and/or password incorrect'), null);
	}
}

function getUserId(authId, callback) {
	if(database.sessionTable[authId]) {
		callback(null, database.sessionTable[authId]);
	} else {
		console.log('no user id');
		callback(new Error('sessionId invalid'), null);
	}
}

function health() {
	return database;
}
    
module.exports = { validateCredentials, auth, removeSession, addUser, health };
