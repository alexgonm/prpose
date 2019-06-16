const express = require('express');
const User = require('../controllers/usersController');
const router = express.Router();

router
	.get('/all', User.getAll)

	//
	.get('/:username', User.findOne)
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

	.get('/:username/posts', User.getPosts)

	//:username/votes , pour montrer les votes votés par l'utilisateur :username
	.get('/:username/votes', User.getUpvotes);

module.exports = router;
