const express = require('express');
const db = require('../models/db');
const router = express.Router();

router
	.get('/all', (req, res) => {
		db.query(
			'SELECT ??, ??, ??, ??, ?? FROM ?? ORDER BY creation_date DESC',
			[
				'username',
				'age',
				'creation_date',
				'creation_hour',
				'biography',
				'users'
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
					res.end();
				}
				res.json(rows);
			}
		);
	})

	//
	.get('/:username', (req, res) => {
		db.query(
			'SELECT ??, ??, ??, ??, ?? FROM ?? WHERE username = ?',
			[
				'username',
				'age',
				'creation_date',
				'creation_hour',
				'biography',
				'users',
				req.params.username
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.json(rows);
			}
		);
	})
	// .delete((req, res) => { //suppression du compte
	//     if (req.session.isLoggedIn){

	//     }
	//     db.query('DELETE FROM ?? WHERE username = ?',
	//         ['users', req.params.username], (err, rows) => {
	//             if (err) {
	//                 res.sendStatus(500);
	//                 res.end()
	//             }
	//             res.json(rows);
	//         })
	// });

	.get('/:username/posts', (req, res) => {
		db.query(
			'SELECT posts.* FROM ??, ?? WHERE users.username = posts.username AND users.username = ? ORDER BY ?? DESC, ?? DESC',
			[
				'posts',
				'users',
				req.params.username,
				'publication_date',
				'publication_hour'
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.json(rows);
			}
		);
	})

	//:username/votes , pour montrer les votes votés par l'utilisateur :username
	.get('/:username/votes', (req, res) => {
		db.query(
			'SELECT ??.* FROM ??, ?? WHERE ?? = ?? AND ?? = ? AND ?? = ? ORDER BY ?? DESC, ?? DESC;',
			[
				'posts',
				'posts',
				'post_vote',
				'posts.post_id',
				'post_vote.post_id',
				'post_vote.upvote',
				1,
				'post_vote.username',
				req.params.username,
				'publication_date',
				'publication_hour'
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.json(rows);
			}
		);
	});

module.exports = router;
