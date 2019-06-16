const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redis = require('redis');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const redisClient = redis.createClient();

redisClient.on('error', err => {
	console.log('Redis error: ', err);
});

dotenv.config({
	path: './.env'
});

const PORT = process.env.PORT || 3000;
const SESS_ID = 'sessionId';
const SESS_SECRET = process.env.SESS_SECRET || 's1nGegaRdi3n';
const NODE_ENV = process.env.NODE_ENV || 'development';
const SESS_SECURE = NODE_ENV === 'production';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

app
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())

	.use(
		session({
			name: SESS_ID,
			secret: SESS_SECRET,
			resave: false,
			saveUninitialized: true,
			cookie: {
				maxAge: 600000000,
				sameSite: true,
				secure: SESS_SECURE
			},
			store: new redisStore({
				host: 'localhost',
				port: 6379,
				client: redisClient
			})
		})
	)

	// .use(
	// 	cors({
	// 		//TODO:
	// 		credentials: true
	// 	})
	// )

	.use(require('./routes/authentication'))
	.use('/user', require('./routes/users'))
	.use('/theme', require('./routes/themes'))
	.use('/post', require('./routes/posts'))
	.use('/comment', require('./routes/comments'))

	.use((req, res, next) => {
		res.sendStatus(404);
	})
	.listen(PORT, () => {
		//App sur le port 4000
		console.log(`Server running on port ${PORT}`);
	});
