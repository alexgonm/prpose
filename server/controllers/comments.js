const db = require('../models/database');

const Comment = {
	getAll: (req, res) => {
		db.query('SELECT * FROM ??', ['comments'], (err, rows) => {
			if (err) {
				res.sendStatus(500);
			}
			res.json(rows);
		});
	},
	findOne: (req, res) => {
		db.query(
			'SELECT * FROM ?? WHERE comment_id = ?',
			['comments', req.params.commentID],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.json(rows);
			}
		);
	},
	deleteOne: (req, res) => {
		if (req.session.isLoggedIn) {
			db.query(
				//On vérifie  que l'utilisateur connecté est bien l'utilisateur qui a posté le commentaire
				'SELECT ?? FROM ??, ?? WHERE ?? = ?? AND ?? = ? AND ?? = ?',
				[
					'comments.username',
					'comments',
					'users',
					'comments.username',
					'users.username',
					'comments.username',
					req.session.username,
					'comments.comment_id',
					req.params.commentID
				],
				(err, rows) => {
					//Si c'est le bon utilisateur
					if (rows.length > 1) {
						db.query(
							'DELETE FROM ?? WHERE comment_id = ?',
							['comments', req.params.commentID],
							(err, rows) => {
								if (err) {
									res.sendStatus(500);
								}
								res.send(200);
							}
						);
						//Autrement, il n'a pas le droit
					} else res.sendStatus(401);
				}
			);
			//Pas le droit si l'utilisateur n'est pas connecté
		} else res.sendStatus(401);
	},
	getComments: (req, res) => {
		db.query(
			'SELECT ??.* FROM ?? JOIN (SELECT * FROM posts) ?? WHERE ?? = ?? AND ?? = ?',
			[
				'children',
				'comments',
				'children',
				'parent.post_id',
				'children.post_parent_id',
				'children.post_id',
				req.params.commentID
			],
			(err, rows) => {
				if (err) res.sendStatus(500);
				res.send(rows);
			}
		);
	},
	getUpvotes: (req, res) => {
		db.query(
			'SELECT count(comment_vote.*) FROM ??, ?? WHERE comments.comment_id = comment_vote.comment_id AND comments.comment_id = ? AND comment_vote.upvote = 1',
			['comments', 'comment_vote', req.params.commentID],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	getDownvotes: (req, res) => {
		db.query(
			'SELECT count(comment_vote.*) FROM ??, ?? WHERE comments.comment_id = comment_vote.comment_id AND comments.comment_id = ? AND comment_vote.upvote = 0',
			['comments', 'comment_vote', req.params.commentID],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	giveUpvote: (req, res) => {
		if (req.session.isLoggedIn) {
			db.query(
				'INSERT INTO comment_vote(??, ??, ??) VALUES (?, ?, ?)',
				[
					'upvote',
					'username',
					'comment_id',
					1,
					req.session.username,
					req.params.commentID
				],
				(err, rows) => {
					if (err) {
						res.sendStatus(500);
					}
					res.send(rows);
				}
			);
		} else {
			res.sendStatus(401);
		}
	},
	giveDownvote: (req, res) => {
		if (req.session.isLoggedIn) {
			db.query(
				'INSERT INTO comment_vote(??, ??, ??) VALUES (?, ?, ?)',
				[
					'upvote',
					'username',
					'comment_id',
					0,
					req.session.username,
					req.params.commentID
				],
				(err, rows) => {
					if (err) {
						res.sendStatus(500);
					}
					res.send(rows);
				}
			);
		} else {
			res.sendStatus(401);
		}
	},
	newComment: (req, res) => {
		if (req.session.isLoggedIn) {
			db.query(
				'INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
				[
					'comments',
					'username',
					'post_id',
					'content',
					req.session.username,
					req.body.postID,
					req.body.commentContent
				],
				(err, rows) => {
					if (err) {
						res.sendStatus(500);
					}
					console.log('commentID créé', rows.insertID);
					res.send(rows);
				}
			);
		} else {
			res.sendStatus(401);
		}
	},
	newChildComment: (req, res) => {
		if (req.session.isLoggedIn) {
		}
		db.query(
			'INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
			[
				'comments',
				'username',
				'post_id',
				'comment_id_parent',
				'content',
				req.session.username,
				req.body.postID,
				req.body.commentID,
				req.body.commentContent
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				console.log('commentID créé', rows.insertID);
				res.send(rows);
			}
		);
	}
};

module.exports = Comment;
