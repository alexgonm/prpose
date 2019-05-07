let express = require('express');
let app = express();
let db = require('./database/db.js');
let bodyParser = require('body-parser');
let session = require('express-session');
var path = require('path');


app.use(require('./routes/users'));
app.use(require('./routes/themes'));
app.use(require('./routes/posts'));



app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }))
    .use(bodyParser.json())



app.post('/auth', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM ?? WHERE username = ? AND password = ?', ["users",username, password], function (error, results, fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            } else {
                response.send('Incorrect Username and/or Password!');
            }
            response.end();
        });
    } else {
        response.send('Please enter Username and Password!');
        response.end();
    }
})




.listen(3000, function () {//App sur le port 4000
    console.log('Server port 3000')
});