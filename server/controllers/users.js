const db = require('../models/database');

const User = {
	getAll: (req, res) => {
		//Obtenir tous les utilisateurs
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
	},
	findOne: (req, res) => {
		//Obtenir un utilisateur
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
	},
	getPosts: (req, res) => {
		//Obtenir les publications d'un utilisateur
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
	},
	getUpvotes: (req, res) => {
		//Obtenir les publications pour lesquels l'utilisateur a voté positivement
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
				const posts = rows.map(row => {
					return {
						postId: row.post_id,
						parentId: row.post_parent_id,
						username: row.username,
						title: row.title,
						content: row.content,
						publicationDate: row.publication_date,
						publicationHour: row.publication_hour
					};
				});
				res.send(posts);
			}
		);
	}
};

module.exports = User;
