const express = require('express');
const axios = require('axios');
const db = require('../database/db');
const router = express.Router();

const UCLAS_TOKEN = process.env.UCLAS_TOKEN;

const instance = axios.create({
	baseURL: 'https://api.uclassify.com/v1',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Token ${UCLAS_TOKEN}`
	}
});

router
	.get('/all', (req, res) => {
		if (req.query.sort) {
			switch (req.query.sort) {
				case 'new':
					db.query(
						'SELECT * FROM ?? ORDER BY ?? DESC, ?? DESC',
						['posts', 'publication_hour', 'publication_date'],
						(err, rows) => {
							if (err) {
								res.sendStatus(500);
							}
							res.send(rows);
						}
					);
					break;
				case 'best':
					db.query(
						'SELECT posts.*, u.positive, (t.total - u.positive) AS negative,  ((u.positive + 1.9208) / (u.positive + (t.total - u.positive)) - 1.96 * SQRT((u.positive * (t.total - u.positive)) / (u.positive + (t.total - u.positive)) + 0.9604) /(u.positive + (t.total - u.positive))) / (1 + 3.8416 / ( u.positive +  (t.total - u.positive))) AS ci_lower_bound ' +
							'FROM posts ' +
							'INNER JOIN (SELECT post_id, count(*) AS positive FROM post_vote WHERE post_vote.upvote = 1 GROUP BY post_id) u ON u.post_id = posts.post_id ' +
							'INNER JOIN (SELECT post_id, count(*) AS total from post_vote GROUP BY post_id) t ON t.post_id = posts.post_id ' +
							'WHERE  (u.positive + (t.total - u.positive) > 0) ' +
							'ORDER BY ci_lower_bound DESC, publication_date DESC;',
						(err, rows) => {
							if (err) {
								console.log(err);
								res.sendStatus(500);
							}
							res.send(rows);
						}
					);
					break;
				default:
					res.sendStatus(500);
			}
		} else {
			db.query('SELECT * FROM ??', ['posts'], (err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			});
		}
	})

	.route('/:postID') //Obtenir de la publication 'postID'
	.get((req, res) => {
		db.query(
			'SELECT * FROM ?? WHERE posts.post_id = ?',
			['posts', req.params.postID],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.json(rows);
			}
		);
	})
	.put((req, res) => {
		//On ne prvoie pas d'autoriser la modification d'une publication pour garder le thème d'origine et ne pas avoir à le changer pour cette publication.
		// const method = req.method; const routePath = req.route.path; const query = req.query;
		// console.log({ method, routePath, query });
		// db.query(
		//     'UPDATE ?? SET ?? = ?  WHERE post_id = ?',
		//     ['posts', 'content', req.body.postContent, req.params.postID], function (err, rows) {
		//         if (err) {
		//             res.sendStatus(500);
		//             res.end()
		//         }
		//         res.json(rows)
		//     }
		// )
	})
	.delete((req, res) => {
		if (req.session.isLoggedIn) {
			db.query(
				//On vérifie  que l'utilisateur connecté est bien l'utilisateur qui a posté la publication
				'SELECT ?? FROM ??, ?? WHERE ?? = ?? AND ?? = ? AND ?? = ?',
				[
					'posts.username',
					'posts',
					'users',
					'posts.username',
					'users.username',
					'posts.username',
					req.session.username,
					'posts.post_id',
					req.params.postID
				],
				(err, rows) => {
					//Si c'est bien lui
					if (rows.length > 1) {
						db.query(
							'DELETE FROM ?? WHERE posts.post_id = ?',
							['posts', req.params.postID],
							(err, rows) => {
								if (err) {
									res.sendStatus(500);
								}
								res.send(200);
							}
						);
						//Sinon il n'a pas le droit
					} else res.sendStatus(401);
				}
			);
			//Il faut être connecté pour supprimer
		} else res.sendStatus(401);
	});

//Seulement les commentaires 'racine', ceux qui n'ont pas de parents
router
	.get('/:postID/comments', (req, res) => {
		if (req.query.sort) {
			switch (req.query.sort) {
				case 'new':
					db.query(
						'SELECT * FROM ??, ?? WHERE ?? = ?? AND ?? = ? ORDER BY ?? DESC, ?? DESC',
						[
							'comments',
							'posts',
							'posts.post_id',
							'comments.post_id',
							'comments.post_id',
							req.params.postID,
							'publication_hour',
							'publication_date'
						],
						(err, rows) => {
							if (err) {
								res.sendStatus(500);
							}
							res.send(rows);
						}
					);
					break;
				case 'best':
					db.query(
						'SELECT comments.*, u.positive, (t.total - u.positive) AS negative,  ((u.positive + 1.9208) / (u.positive + (t.total - u.positive)) - 1.96 * SQRT((u.positive * (t.total - u.positive)) / (u.positive + (t.total - u.positive)) + 0.9604) /(u.positive + (t.total - u.positive))) / (1 + 3.8416 / ( u.positive +  (t.total - u.positive))) AS ci_lower_bound ' +
							'FROM comments, posts ' +
							'INNER JOIN (SELECT comment_id, count(*) AS positive FROM comment_vote WHERE comment_vote.upvote = 1 GROUP BY comment_id) u ON u.comment_id = comments.comment_id ' +
							'INNER JOIN (SELECT comment_id, count(*) AS total from comment_vote GROUP BY comment_id) t ON t.comment_id = comments.comment_id ' +
							'WHERE  comments.post_id = posts.post_id AND comments.post_id = ? AND (u.positive + (t.total - u.positive) > 0) ' +
							'ORDER BY ci_lower_bound DESC;',
						[req.params.postID],
						(err, rows) => {
							if (err) {
								console.log(err);
								res.sendStatus(500);
							}
							res.send(rows);
						}
					);
					break;
				default:
					res.sendStatus(500);
			}
		} else
			db.query(
				'SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.comment_id_parent = NULL AND comments.post_id = ?',
				['comments', 'posts', req.params.postID],
				(err, rows) => {
					if (err) {
						res.sendStatus(500);
					}
					res.json(rows);
				}
			);
	})

	.get('/:postID/themes', (req, res) => {
		db.query(
			'SELECT ??.* FROM ??, ??, ?? WHERE ?? = ?? AND ?? = ?? AND ?? = ?',
			[
				'themes',
				'posts',
				'post_theme',
				'themes',
				'post_theme.post_id',
				'posts.post_id',
				'post_theme.theme',
				'themes.theme',
				'posts.post_id',
				req.params.postID
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	})

	//Obtenir les posts enfants d'un post
	.get('/:postID/posts', (req, res) => {
		db.query(
			'SELECT ??.* FROM ?? JOIN (SELECT * FROM posts) ?? WHERE ?? = ?? AND ?? = ?',
			[
				'children',
				'posts',
				'children',
				'posts.post_id',
				'children.post_id',
				'children.post_parent_id',
				req.params.postID
			],
			(err, rows) => {
				console.log(err);
				if (err) res.sendStatus(500);
				res.send(rows);
			}
		);
	})

	// router.get('/:postID/vote',(req, res) => {
	//     const method = req.method; const routePath = req.route.path; const query = req.query;
	//     console.log({ method, routePath, query });
	//     db.query('SELECT post_vote.* FROM ??, ??, ?? WHERE post_vote.username = users.username AND post_vote.post_id = posts.post_id AND post_vote.post_id = ? AND post_vote.username = ?',
	//     ['posts', 'post_vote', 'users', req.params.postID, req.body.loggedUser], function(err, rows){
	//         if(err){
	//             res.sendStatus(500);
	//             res.end()
	//         }
	//         res.json(rows)
	//     })
	// })

	.get('/:postID/upvotes', (req, res) => {
		db.query(
			'SELECT count(post_vote.*) FROM ??, ?? WHERE posts.post_id = post_vote.post_id AND post_vote.post_id = ? AND post_vote.upvote = 1',
			['posts', 'post_vote', req.params.postID],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	})

	.get('/:postID/downvotes', (req, res) => {
		db.query(
			'SELECT count(??.*) FROM ??, ?? WHERE ?? = ?? AND ?? = ? AND ?? = 0',
			[
				'post_vote',
				'posts',
				'post_vote',
				'posts.post_id',
				'post_vote.post_id',
				'post_vote.post_id',
				req.params.postID,
				'post_vote.upvote'
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	})

	.post('/:postID/upvote', (req, res) => {
		if (req.session.isLoggedIn) {
			db.query(
				'INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
				[
					'post_vote',
					'upvote',
					'username',
					'post_id',
					1,
					req.session.username,
					req.body.postID
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
	})

	.post('/:postID/downvote', (req, res) => {
		if (req.session.isLoggedIn) {
			db.query(
				'INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
				[
					'post_vote',
					'upvote',
					'username',
					'post_id',
					0,
					req.session.username,
					req.body.postID
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
	})

	.post('/createPost', (req, res) => {
		//Si un utilisateur est connecté
		if (req.session.isLoggedIn) {
			const contentToClassify = JSON.stringify({
				texts: [req.body.postContent]
			});
			instance
				.post('/uclassify/topics/fr/classify', contentToClassify)
				.then(response => {
					//console.log(response.data[0].classification);
					if (response.data[0].textCoverage >= 0.5) {
						const categories = relevantCategories(response.data[0]);
						//console.log(categories)
						db.query(
							'INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
							[
								'posts',
								'username',
								'title',
								'content',
								req.session.username,
								req.body.postTitle,
								req.body.postContent
							],
							(err, rows) => {
								if (err) {
									console.log(err);
									res.sendStatus(500);
								}
								console.log(rows);
								const postID = rows.insertId;
								//console.log('postID créé: ', postID)
								for (index = 0; index < categories.length; index++) {
									db.query('INSERT INTO ??(??, ??) VALUES (?, ?);', [
										'post_theme',
										'post_id',
										'theme',
										postID,
										categories[index]
									]);
								}
								//res.sendStatus(200);
								res.send(rows);
							}
						);
					} else {
						res.sendStatus(500);
					}
				})
				.catch(error => {
					console.log(error);
					res.sendStatus(500);
				});
		} else {
			res.sendStatus(401);
		}
	})

	//TODO: transformer les requêtes en transaction pour être sûr du résultats
	.post('/createChildPost', (req, res) => {
		if (req.session.isLoggedIn) {
			const contentToClassify = JSON.stringify({
				texts: [req.body.postContent]
			});
			instance
				.post('/uclassify/topics/fr/classify', contentToClassify)
				.then(response => {
					//console.log(response.data[0].classification);
					if (response.data[0].textCoverage >= 0.5) {
						const categories = relevantCategories(response.data[0]);
						//console.log(categories)
						db.query(
							'INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
							[
								'posts',
								'username',
								'post_parent_id',
								'title',
								'content',
								req.session.username,
								req.body.postID,
								req.body.postTitle,
								req.body.postContent
							],
							(err, rows) => {
								if (err) {
									console.log(err);
									res.sendStatus(500);
								}
								console.log(rows);
								const postID = rows.insertId;
								//console.log('postID créé: ', postID)
								for (index = 0; index < categories.length; index++) {
									db.query(
										'INSERT INTO ??(??, ??) VALUES (?, ?);',
										[
											'post_theme',
											'post_id',
											'theme',
											postID,
											categories[index]
										],
										(err, rows) => {
											console.log(rows.insertId);
										}
									);
								} //res.sendStatus(200);
								res.send(rows);
							}
						);
					} else {
						res.sendStatus(500);
					}
				})
				.catch(error => {
					console.log(error);
					res.sendStatus(500);
				});
		} else {
			res.sendStatus(401);
		}
	});

//On veut prendre seulement les catégories qui sont pertinentes
function relevantCategories(data) {
	//Remarque: possibilité de sort(function (a,b){return a.p > b.p;}) au lieu de passer par un Map
	var probaOfCategory = new Map([]);
	data.classification.forEach(category => {
		//console.log(`Name: ${category.className}, Confidence: ${category.p}`);
		probaOfCategory.set(category.p, category.className);
	});
	//On prend les probabilité, on les tri dans l'ordre décroissant
	const probabilities = Array.from(probaOfCategory.keys())
		.sort()
		.reverse();
	//On supprime les probabilités qui ne sont pas assez grandes
	for (index = 1; index < probabilities.length; index++) {
		if (probabilities[0] - probabilities[index] > 0.1) {
			//0.1 est un chiffre arbitraire
			probabilities.splice(index, probabilities.length - index);
		}
	}
	//On retourne les catégories auxquels correspondent les probabilités de l'Array probabilities
	return getCategories(probabilities, probaOfCategory);
}

function getCategories(probabilities, probabilitiesMap) {
	const categories = [];
	for (index = 0; index < probabilities.length; index++) {
		categories.push(probabilitiesMap.get(probabilities[index]));
	}
	return categories;
}

module.exports = router;
