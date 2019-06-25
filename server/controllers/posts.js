const db = require('../models/database');
const uClassify = require('../models/uClassify').instance;

const Post = {
	getAll: (req, res) => {
		//Obtenir tous les posts
		switch (req.query.sort) {
			case 'new': //Tri par nouvelle publication
				db.query(
					'SELECT * FROM ?? ORDER BY ?? DESC, ?? DESC',
					['posts', 'publication_date', 'publication_hour'],
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
				break;
			case 'top': //Tri par les publications avec le plus d'upvote
				db.query(
					'SELECT ??.*, u.positive, (t.total - u.positive) AS negative ' +
						'FROM (??, ??, ??) ' +
						'INNER JOIN (SELECT post_id, count(*) AS positive FROM post_vote WHERE post_vote.upvote = 1 GROUP BY post_id) u ON u.post_id = posts.post_id ' +
						'INNER JOIN (SELECT post_id, count(*) AS total FROM post_vote GROUP BY post_id) t ON t.post_id = posts.post_id ' +
						'WHERE ?? = ?? AND ?? = ?? AND ?? = ? ' +
						'ORDER BY ?? DESC;',
					[
						'posts',
						'posts',
						'post_theme',
						'themes',
						'post_theme.post_id',
						'posts.post_id',
						'themes.theme',
						'post_theme.theme',
						'post_theme.theme',
						req.params.theme,
						'u.positive'
					],
					(err, rows) => {
						if (err) {
							console.log(err);
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
				break;
			default:
			case 'best': //Tri par les publications les mieux votés par jour (en considérant le nombre total de votes et la part de votes positifs)
				db.query(
					'SELECT posts.*, u.positive, (t.total - u.positive) AS negative,  ((u.positive + 1.9208) / (t.total ) - 1.96 * SQRT((u.positive * (t.total - u.positive)) / (t.total) + 0.9604) /(t.total ) / (1 + 3.8416 /  (t.total))) AS ci_lower_bound ' +
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
				break;
		}
	},

	findOne: (req, res) => {
		//Obtenir une publication
		db.query(
			'SELECT * FROM ?? WHERE posts.post_id = ?',
			['posts', req.params.postID],
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
	},
	// updatePost: (req, res) => {

	// },
	deleteOne: (req, res) => {
		//Supprmier une publication
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
	},
	getComments: (req, res) => {
		//Obtenir les commentaires d'une publications
		switch (req.query.sort) {
			case 'new':
				db.query(
					'SELECT * FROM ??, ?? WHERE ?? = ?? AND ?? = ?? AND ?? = ? ORDER BY ?? DESC, ?? DESC',
					[
						'comments',
						'posts',
						'posts.post_id',
						'comments.post_id',
						'comments.comment_id_parent',
						'NULL',
						'comments.post_id',
						req.params.postID,
						'comments.publication_date',
						'comments.publication_hour'
					],
					(err, rows) => {
						if (err) {
							res.sendStatus(500);
						}
						const comments = rows.map(row => {
							return {
								commentId: row.comment_id,
								parentId: row.comment_id_parent,
								username: row.username,
								content: row.content,
								publicationDate: row.publication_date,
								publicationHour: row.publication_hour
							};
						});

						res.send(comments);
					}
				);
				break;
			default:
			case 'top':
				db.query(
					'SELECT ??.* FROM ??, ?? INNER JOIN (SELECT comment_id, count(*) AS positive FROM comment_vote WHERE comment_vote.upvote = 1 GROUP BY comment_id) u ON u.comment_id = comments.comment_id  WHERE ?? = ?? AND ?? = ?? AND ?? = ? ' +
						''[
							('comments',
							'comments',
							'posts',
							'posts.post_id',
							'comments.post_id',
							'comments.comment_id_parent',
							'NULL',
							'comments.post_id',
							req.params.postID)
						],
					(err, rows) => {
						if (err) {
							console.log(err);
							res.sendStatus(500);
						}

						const comments = rows.map(row => {
							return {
								commentId: row.comment_id,
								parentId: row.comment_id_parent,
								username: row.username,
								content: row.content,
								publicationDate: row.publication_date,
								publicationHour: row.publication_hour
							};
						});

						res.send(comments);
					}
				);
				break;
		}
	},
	getThemes: (req, res) => {
		//Obtenir les thèmes d'une publication
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
	},
	getChildren: (req, res) => {
		//Obtenir les publications répondant à une publication
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
	},
	getUpvotes: (req, res) => {
		//Obtenir les upvotes d'une publication
		db.query(
			'SELECT count(??) AS upvotes FROM ??, ?? WHERE ?? = ?? AND ?? = ? AND ?? = 1',
			[
				'post_vote.upvote',
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
					console.log(err);
					res.sendStatus(500);
				}
				res.send(rows);
			}
		);
	},
	getDownvotes: (req, res) => {
		//Obtenir les downvotes d'une publication
		db.query(
			'SELECT count(??) AS downvotes FROM ??, ?? WHERE ?? = ?? AND ?? = ? AND ?? = 0',
			[
				'post_vote.upvote',
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
	},
	giveUpvote: (req, res) => {
		//Donner un upvote à une pubilcation
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
					req.params.postID
				],
				(err, rows) => {
					if (err) {
						console.log(err);
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
		//Donner un downvote à une publication
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
					req.params.postID
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
	//Savoir si un upvote est possible
	getVoteState: (req, res) => {
		db.query(
			'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?',
			[
				'post_vote',
				'post_id',
				req.params.postID,
				'username',
				req.session.username
			],
			(err, rows) => {
				if (err) {
					res.sendStatus(500);
				} else if (rows.length > 0) {
					res.sendStatus(403);
				} else {
					res.sendStatus(200);
				}
			}
		);
	},

	//TODO: transformer les requêtes en transaction pour être sûr du résultats ou en promesse
	createPost: (req, res) => {
		//Poster un publication
		//Si un utilisateur est connecté
		if (req.session.isLoggedIn) {
			const contentToClassify = JSON.stringify({
				texts: [req.body.postContent]
			});
			uClassify
				.post('/uclassify/topics/fr/classify', contentToClassify)
				.then(response => {
					//console.log(response.data[0].classification);
					if (response.data[0].textCoverage >= 0.5) {
						const categories = getRelevantCategories(
							response.data[0]
						);
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
								for (
									index = 0;
									index < categories.length;
									index++
								) {
									db.query(
										'INSERT INTO ??(??, ??) VALUES (?, ?);',
										[
											'post_theme',
											'post_id',
											'theme',
											postID,
											categories[index]
										]
									);
								}
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
	},
	createChild: (req, res) => {
		//Poster une publication répondant à une publication
		if (req.session.isLoggedIn) {
			const contentToClassify = JSON.stringify({
				texts: [req.body.postContent]
			});
			uClassify
				.post('/uclassify/topics/fr/classify', contentToClassify)
				.then(response => {
					//console.log(response.data[0].classification);
					if (response.data[0].textCoverage >= 0.5) {
						const categories = getRelevantCategories(
							response.data[0]
						);
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
								for (
									index = 0;
									index < categories.length;
									index++
								) {
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
								}
								res.status(200).send(rows);
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
	}
};

//On veut prendre seulement les catégories qui sont pertinentes
function getRelevantCategories(data) {
	//Remarque: possibilité de sort(function (a,b){return a.p > b.p;}) au lieu de passer par un Map

	//On créé un dictionnaire liant une probabilité à une catégorie
	var probaOfCategory = new Map([]);
	data.classification.forEach(category => {
		//console.log(`Name: ${category.className}, Confidence: ${category.p}`);
		probaOfCategory.set(category.p, category.className);
	});
	//On prend les probabilité, on les tri dans l'ordre décroissant
	const probabilities = Array.from(probaOfCategory.keys())
		.sort()
		.reverse();
	//On supprime les probabilités qui ne sont pas assez grandes (on prend seulement les catégories qui n'ont pas une grande différence par rapport à la première catégorie)
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

module.exports = Post;
