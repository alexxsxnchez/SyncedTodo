'use strict';

const express = require('express');
const router = express.Router();
const db = require('./db.js').db;
const ObjectId = require('mongodb').ObjectId;

router.post('/', async (req, res) => {
	const username = req.locals.username;
	const workspace = req.body.workspace;
	const description = req.body.description;
	const completed = false;
	const created_at = Date.now();
	const todo = {
		username,
		workspace,
		description,
		completed,
		created_at
	}
	try {
		const result = await db().collection('todo').insertOne(todo);
		const id = result.insertedId;
		console.log(id);
		res.status(200).send(id);
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

router.get('/', async (req, res) => {
	const todoId = req.body.todoId;
	console.log(todoId);
	try {
		const result = await db().collection('todo').findOne({ _id: new ObjectId(todoId) });
		if(result) {
			res.status(200).json(result);
		} else {
			res.status(400).end();
		}
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

router.put('/complete', async (req, res) => {
	const todoId = req.body.todoId;
	const completed = req.body.completed;
	try {
		await db().collection('todo').update({ _id: ObjectId(todoId) }, {$set: { completed: completed }});
		res.status(200).end();
	} catch (err) {
		console.log(err);
		res.status(500).end();
	}
});

module.exports = router;
