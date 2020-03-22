'use strict';

const config = require('./config.js').db;
const MongoClient = require('mongodb').MongoClient;
const mongoSession = require('connect-mongodb-session');

const state = {
	client: null,
	db: null
};

const uri = `mongodb+srv://${config.username}:${config.password}@cluster0-dbckl.mongodb.net/test?retryWrites=true&w=majority`;

module.exports.getSessionStore = (session) => {
	const MongoDBStore = mongoSession(session);
	return new MongoDBStore({
		uri,
		collection: "sessions-test"
	});
}

module.exports.connect = async () => {
	if(state.db) {
		return;
	}
	const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
	try {
		await client.connect();
		state.client = client;
		state.db = client.db(config.databaseName);
		console.log('Connected to database!');
	} catch (err) {
		console.error(`DB Connection Error: ${err}`);
		throw new Error('Could not connect to db');
	}
};

module.exports.db = () => {
	if(state.db) {
		return state.db;
	}
	throw new Error('Database does not exist');
};

module.exports.close = () => {
	if(state.client) {
		state.client.close();
	}
};
