'use strict';

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const router = require('./router.js');
const session = require('express-session'); //client-sessions
const uuid = require('uuid/v4');
const helmet = require('helmet');

const app = express();

const port = 8000;

app.use(helmet());

app.use(session({
	genid: () => {
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


const uri = "mongodb+srv://admin:admin@cluster0-dbckl.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    if(err) {
        console.log(`Error: ${err}`);
        return;
    }
    const db = client.db("test");
    db.collection("test").insertOne({
        testKey: "test"
    }, (err, res) => {
        if(err) {
            console.log("couldn't insert");
            return;
        }
        client.close();
    });

    //const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    app.listen(port, () => {
	    console.log(`listening on port ${port}`);
    });
});

/*
app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
*/

