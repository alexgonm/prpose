const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

const PORT = process.env.PORT || 3000;
const SESS_ID = 'sid'
const SESS_SECRET = 's1nGegaRdi3n'
const ENV = "development"
const SESS_SECURE = ENV === "production"

app.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

app.use(session({
    name: SESS_ID,
    secret: SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7000000000,
        sameSite: true,
        secure: SESS_SECURE
    }
}));

app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/themes'));
app.use(require('./routes/posts'));
app.use(require('./routes/comments'));

app.use((req, res, next) => {
        res.setHeader('Content-Type', 'text/html');
    res.status(404).send('<h3>Uh-Oh! There seems to be something wrong.</h3>');
    })

    .listen( PORT, () => {//App sur le port 4000
        console.log('Server port 3000')
    });