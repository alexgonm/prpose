const express = require('express');
const db = require('../models/db');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();
const Auth = require('../controllers/authController');

const BCRYPT_SALT_ROUNDS = 10;

router
	.get('/', function(req, res) {
		//res.setHeader('Content-Type', 'text/html');
		res.sendStatus(200);
	})

	.route('/login')
	.get((req, res) => {
		if (!req.session.isLoggedIn) {
			res.setHeader('Content-type', 'text/html');
			res.sendFile(path.join(__dirname, '/../login.html'));
		} else {
			res.redirect('/');
		}
	})
	.post((req, res) => {
		var username = req.body.username;
		var password = req.body.password;
		if (username && password) {
			db.query(
				'SELECT * FROM ?? WHERE username = ?',
				['users', username],
				function(err, rows, fields) {
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
	}),
	router
		.route('/signup')
		.get((req, res) => {
			if (!req.session.isLoggedIn) res.sendStatus(200);
			else {
				res.sendStatus(403);
			}
		})
		.post(Auth.signup);

router.get('/logout', Auth.logout);

module.exports = router;
