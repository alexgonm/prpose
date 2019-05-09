let express = require('express');
let app = express();
let db = require('./database/db.js');
let bodyParser = require('body-parser');
let session = require('express-session');




app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


app.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())



app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/themes'));
app.use(require('./routes/posts'));
app.use(require('./routes/comments'));

    



app.use((req, res, next) => {
        res.setHeader('Content-Type', 'text/plain');
        res.status(404).send('Page introuvable !');
    })

    .listen(3000, () => {//App sur le port 4000
        console.log('Server port 3000')
    });