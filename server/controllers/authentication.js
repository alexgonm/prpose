const db = require('../models/db');
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
			db.query(
				'SELECT users.username FROM users WHERE users.username = ? OR users.email = ?',
				[user, email],
				(err, rows) => {
					if (err) res.sendStatus(500);
					//('Username/email already used.');
					else if (rows.length > 0) res.sendStatus(409);
					//Si l'utilisateur n'existe pas
					else {
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
		if (username && password) {
			db.query(
				'SELECT * FROM ?? WHERE username = ?',
				['users', username],
				(err, rows, fields) => {
					if (rows.length > 0) {
						var hash = rows.map(row => {
							return row.password;
						});
						//console.log(hash[0])
						bcrypt.compare(password, hash[0]).then(result => {
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
		if (!req.session.isLoggedIn) {
			res.sendStatus(401);
		} else {
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
