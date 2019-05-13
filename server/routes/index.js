const express = require('express');
const db = require('../database/db');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();

const BCRYPT_SALT_ROUNDS = 10;


router.get('/', function (req, res) {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    res.setHeader('Content-Type', 'text/plain');
    res.send('PrPose')
})

router.route('/login')
    .get((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        res.setHeader('Content-type', 'text/html');
        res.sendFile(path.join(__dirname, '/../login.html'));
    })

    .post(function (req, res) {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        var username = req.body.username;
        var password = req.body.password;        bcrypt.compare('somePassword', hash, function (err, res) {
            if (res) {
                // Passwords match
            } else {
                // Passwords don't match
            }
        });
        if (username && password) {
            bcrypt.compare(password, hash, function (error, result) {
                if (result) {
                    // Passwords match
                    db.query('SELECT * FROM ?? WHERE username = ? AND password = ?', ["users", username, hash], function (err, rows, fields) {
                    if (rows.length > 0) {
                        //req.session.loggedIn = true;
                        //req.session.username = username;
                        res.redirect('/');
                    } else {
                        res.send('Incorrect Username and/or Password!');
                    }
                    res.end();
                    });
                }
            });
            
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    })

router.route('/signup')
    .get( (req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        res.end()
    })
    .post((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        const usr = req.body.username
        const email = req.body.email
        const psw = req.body.password
        const age = req.body.age
        const bio = req.body.biography
        db.query('SELECT users.username FROM users WHERE users.username = ? OR users.email = ?', 
        [usr, email], function(err, rows){
            if (rows.length > 0){
                res.send('<p>Username/email already used.</p>');
            }
        })
        bcrypt.hash(psw, BCRYPT_SALT_ROUNDS, function (err, hash) {
            db.query('INSERT INTO users(??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)',
                ['username', 'email', 'password', 'age', 'biography', usr, email, hash, age, bio], function (err, rows) {
                    if (err) {
                        console.log(err)
                        res.sendStatus(500);
                        res.end()
                    }
                    res.send('<p>Nice, you\'ve signed up. Welcome to PrPose.</p>')
                    //res.redirect('/');

                })
        });
        //res.end()
    }) 

router.get('/logout', (req, res) => {

})


module.exports = router;