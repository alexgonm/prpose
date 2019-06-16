const express = require('express');
const Theme = require('../controllers/themes');
const router = express.Router();

router
	.get('/all', Theme.getAll)

	.get('/theme/:theme', Theme.findOne)

	.get('/:theme/posts', Theme.getPosts);

module.exports = router;
