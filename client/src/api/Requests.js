import API from './Api';

function getPost(postId) {
	return API.get(`/p/${postId}`);
	// .then(response => {
	// 	return response.data[0];
	// })
	// .catch(err => {
	// 	console.log(err);
	// 	return {};
	// });
}

//Nouvelle publication
function createPost(informations) {
	return API.post('/p/createPost', informations);
}

function createComment(informations) {
	return API.post('/c/newComment', informations);
}

function createCommentChild(informations) {
	return API.post('/c/newChildComment', informations);
}
function getCommentsOfPost(postId, sortOption) {
	return API.get(`/p/${postId}/comments?sort=${sortOption}`);
}

function getCommentsOfComment(commentId) {
	return API.get(`/c/${commentId}/comments`);
}
//Suppresion d'un commentaire ou d'une publication
function deleteElement(type, id) {
	return API.delete(`/${type}/${id}`);
}

function getTheme(themeName) {
	return API.get(`/t/${themeName}`);
	// .then(response => {
	// 	return response.data[0];
	// })
	// .catch(err => {
	// 	console.log(err);
	// 	return {};
	// });
}

function getThemes() {
	return API.get(`/t/all`);
}

function getThemesOfPost(postId) {
	return API.get(`/p/${postId}/themes`);
}

function getUser(username) {
	return API.get(`/u/${username}`);
	// .then(response => {
	// 	return response.data[0];
	// })
	// .catch(err => {
	// 	console.log(err);
	// 	return {};
	// });
}

function isUserLoggedIn() {
	return API.get('/isLoggedIn');
}

export {
	getPost,
	getTheme,
	getUser,
	getThemes,
	getThemesOfPost,
	deleteElement,
	isUserLoggedIn,
	createPost,
	createComment,
	createCommentChild,
	getCommentsOfPost,
	getCommentsOfComment
};
