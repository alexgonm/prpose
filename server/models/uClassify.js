const axios = require('axios');

const UCLASS_TOKEN = process.env.UCLASS_TOKEN;

exports.instance = axios.create({
	baseURL: 'https://api.uclassify.com/v1',
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
		Authorization: `Token ${UCLASS_TOKEN}`
	}
});
