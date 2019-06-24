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

function isLoggedIn(username) {
	return API.get('/login', username);
}

export {
	getPost,
	getTheme,
	getUser,
	getThemes,
	getThemesOfPost,
	deleteElement,
	isLoggedIn
};
