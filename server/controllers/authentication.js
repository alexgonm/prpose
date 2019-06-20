const db = require('../models/database');
const path = require('path');
const bcrypt = require('bcrypt');

const Auth = {
	signup: (req, res) => {
		if (!req.session.isLoggedIn) {
			const user = req.body.username;
			const email = req.body.email;
			const psw = req.body.password;
			const age = req.body.age;
			const bio = req.body.biography;
			const BCRYPT_SALT_ROUNDS = 10;
			//On cherche d'abord s'il existe un utilisateur qui possède le même pseudo ou la même adresse email
			db.query(
				'SELECT users.username FROM users WHERE users.username = ? OR users.email = ?',
				[user, email],
				(err, rows) => {
					if (err) res.sendStatus(500);
					//('Username/email already used.');
					else if (rows.length > 0) res.sendStatus(409);
					//Si l'utilisateur n'existe pas
					else {
						//On chiffre le passport et on envoie le tout à la base de données
						bcrypt.hash(psw, BCRYPT_SALT_ROUNDS).then(hash => {
							db.query(
								'INSERT INTO ??(??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)',
								[
									'users',
									'username',
									'email',
									'password',
									'age',
									'biography',
									user,
									email,
									hash,
									age,
									bio
								],
								(err, rows) => {
									if (err) {
										console.log(err);
										res.sendStatus(500);
									}
									res.sendStatus(200); //('Nice, you\'ve signed up. Welcome to PrPose.')
									//res.redirect('/');
								}
							);
						});
					}
				}
			);
		} else {
			res.sendStatus(403);
		}
	},
	login: (req, res) => {
		var username = req.body.username;
		var password = req.body.password;
		//On cherche s'il existe un utilisateur avoir le même pseudo
		if (username && password) {
			db.query(
				'SELECT * FROM ?? WHERE username = ?',
				['users', username],
				(err, rows) => {
					//Si on a trouvé un utilisateur avec le même pseudo
					if (rows.length > 0) {
						var hash = rows.map(row => {
							return row.password;
						});
						//On compare le mot de passe de la base de données et celui fourni
						bcrypt.compare(password, hash[0]).then(result => {
							//Si c'est le bon mot de passe on ajoute au serveur REDIS l'utilisateur
							if (result) {
								req.session.username = username;
								req.session.isLoggedIn = true;
								//console.log([req.session.username, req.session.isLoggedIn])
								req.session.save(err => {
									// session saved
									res.sendStatus(200);
								});
							} else {
								res.sendStatus(401);
								//setTimeout(() => { res.redirect('/login'); }, 3000);
							}
						});
					}
				}
			);
		} else {
			//res.send('Please enter Username and Password!');
			res.sendStatus(400);
		}
	},
	logout: (req, res) => {
		//Déconnexion
		if (!req.session.isLoggedIn) {
			res.sendStatus(401);
		} else {
			//Suppression de la session
			req.session.destroy(err => {
				if (err) {
					return console.log(err);
				}
				res.sendStatus(200);
			});
		}
	}
};

module.exports = Auth;
