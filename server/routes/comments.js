const express = require('express');
const Comment = require('../controllers/comments');
const router = express.Router();

router
	//Obtenir tous les commentaires
	.get('/comments', Comment.getAll)

	.route('/:commentID')
	//Obtenir un commentaire
	.get(Comment.findOne)
	//Pour simplifier, pour l'instant on ne peut pas modifier les commentaires.

	//Supprimer un commentaire
	.delete(Comment.deleteOne);

router
	//Obtenir les commentaires enfants d'un commentaire
	.get('/:commentID/comments', Comment.getComments)

	//Obtenir le nombre d'upvotes d'un commentaires
	.get('/:commentID/upvotes', Comment.getUpvotes)

	//Obtenir le nombre de downvotes d'un commentaires
	.get('/:commentID/downvotes', Comment.getDownvotes)

	//Publier un upvote
	.post('/:commentID/upvote', Comment.giveUpvote)

	//Publier un downvote
	.post('/:commentID/downvote', Comment.giveDownvote)

	//Publier un nouveau commentaire
	.post('/newComment', Comment.newComment)

	//Publier un commentaire enfant
	.post('/:commentID/newChildComment', Comment.newChildComment);

module.exports = router;
