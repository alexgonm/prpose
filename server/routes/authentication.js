const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();
const Auth = require('../controllers/authentication');

const BCRYPT_SALT_ROUNDS = 10;

router
	.get('/', (req, res) => {
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
	.post(Auth.login),
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
