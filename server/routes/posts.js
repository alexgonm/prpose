const express = require('express');

const Post = require('../controllers/posts');
const router = express.Router();

router
	//
	.get('/all', Post.getAll)
	//
	.route('/:postID')
	//
	.get(Post.findOne)
	//
	.delete(Post.deleteOne);

router
	//
	.get('/:postID/comments', Post.getComments)
	//
	.get('/:postID/themes', Post.getThemes)
	//Obtenir les posts enfants d'un post
	.get('/:postID/posts', Post.getChildren)
	//
	.get('/:postID/upvotes', Post.getUpvotes)
	//
	.get('/:postID/downvotes', Post.getDownvotes)
	//
	.post('/createPost', Post.createPost)
	//
	.post('/createChildPost', Post.createChild)
	//
	.post('/:postID/upvote', Post.giveUpvote)
	//
	.post('/:postID/downvote', Post.giveDownvote);

module.exports = router;
