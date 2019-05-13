const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');

var PORT = process.env.PORT || 3000;
const SESS_ID = 'session_id'


app.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())

app.use(session({
    name: SESS_ID,
    secret: 's1nGegaRdi3n',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 7000000000,
        sameSite: true,
        secure: false
    }
}));

app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/themes'));
app.use(require('./routes/posts'));
app.use(require('./routes/comments'));

app.use((req, res, next) => {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Page introuvable !');
    })

    .listen(PORT, () => {//App sur le port 4000
        console.log('Server port 3000')
    });