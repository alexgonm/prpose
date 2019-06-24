const express = require('express');
const router = express.Router();
const Auth = require('../controllers/authentication');

router
	.get('/', (req, res) => {
		//res.setHeader('Content-Type', 'text/html');
		res.sendStatus(200);
	})
	.post('/isLoggedIn', Auth.isLoggedIn)
	.route('/login')
	.get((req, res) => {
		if (req.session.isLoggedIn) {
			res.sendStatus(401);
		} else {
			res.sendStatus(200);
		}
	})
	.post(Auth.login);
router
	.route('/signup')
	.get((req, res) => {
		if (req.session.isLoggedIn) {
			res.sendStatus(401);
		} else {
			res.sendStatus(200);
		}
	})
	.post(Auth.signup);

router.post('/logout', Auth.logout);

module.exports = router;
