const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redis = require('redis');
const cors = require('cors');
const app = express();
const redisClient = redis.createClient();

redisClient.on('error', err => {
	console.log('Redis error: ', err);
});

const PORT = process.env.PORT || 3000;
const SESS_ID = 'prpose_sid';
const SESS_SECRET = 's1nGegaRdi3n';
const NODE_ENV = process.env.NODE_ENV || 'development';
const SESS_SECURE = NODE_ENV === 'production';

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

	.use(
		cors({
			//TODO:
			credentials: true
		})
	)

	.use('/api', require('./routes/index'))
	.use('/api/user', require('./routes/users'))
	.use('/api/theme', require('./routes/themes'))
	.use('/api/post', require('./routes/posts'))
	.use('/api/comment', require('./routes/comments'))

	.use((req, res, next) => {
		res.sendStatus(404);
	})
	.listen(PORT, () => {
		//App sur le port 4000
		console.log('Server port', PORT);
	});
