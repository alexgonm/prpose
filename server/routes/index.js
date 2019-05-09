let express = require('express');
let db = require('../database/db');
let bodyParser = require('body-parser');
let router = express.Router();


router.get('/', function (req, res) {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    res.setHeader('Content-Type', 'text/plain');
    res.send('PrPose')
})

router.post('/auth', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
        db.query('SELECT * FROM ?? WHERE username = ? AND password = ?', ["users", username, password], function (err, rows, fields) {
            if (rows.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                res.redirect('/');
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




module.exports = router;