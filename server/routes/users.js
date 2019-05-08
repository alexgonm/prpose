let express = require('express');
let db = require('../database/db');
let bodyParser = require('body-parser');
let path = require('path');
let router = express.Router();


router.get('/login', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    res.setHeader('Content-type', 'text/html');
    res.sendFile(path.join(__dirname + '/login.html'));
})

.get('/register', (req, res) =>{
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    res.end()
})


.get('/users', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query(
        'SELECT ??, ??, ??, ??, ?? FROM ??',
        ['username', 'age', 'creation_date', 'creation_hour', 'biography', 'users'], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }

            var users = rows.map((row) => {
                return
            })

            res.json(rows)
        })
});

router.route('/user/:username')
    .get((req, res) => {
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.query);
        db.query('SELECT ??, ??, ??, ??, ?? FROM ?? WHERE username = ?',
            ['username', 'age', 'creation_date', 'creation_hour', 'biography', 'users', req.params.username], function (err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows);
            })
    })
    .delete((req, res) => {
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.query);
        db.query('DELETE FROM ?? WHERE username = ?',
            ['users', req.params.username], function (err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows);
            })
    });

router.get('/user/:username/posts', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('SELECT posts.* FROM ??, ?? WHERE users.username = posts.username AND users.username = ?',
        ['posts', 'users', req.params.username], function (err, rows, fields) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.json(rows);
        })
})

//:username/votes , pour montrer les votes votés par l'utilisateur :username
router.get('/user/:username/votes', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('',
    [], function(err, rows){
        if (err) {
            res.sendStatus(500);
            res.end()
        }
        res.json(rows);
    })
})

module.exports = router;