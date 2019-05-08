let express = require('express');
let app = express();
let db = require('./database/db.js');
let bodyParser = require('body-parser');
let session = require('express-session');



app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/themes'));
app.use(require('./routes/posts'));
app.use(require('./routes/comments'));




app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())



app.post('/auth', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        connection.query('SELECT * FROM ?? WHERE username = ? AND password = ?', ["users",username, password], function (err, rows, fields) {
            if (rows.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/home');
            } else {
                res.send('Incorrect Username and/or Password!');
            }
            res.end();
        });
    } else {
        res.send('Please enter Username and Password!');
        res.end();
    }
})


.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
})


.listen(3000, function () {//App sur le port 4000
    console.log('Server port 3000')
});