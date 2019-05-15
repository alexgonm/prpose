const express = require('express');
const db = require('../database/db');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();

const BCRYPT_SALT_ROUNDS = 10;


router.get('/', function (req, res) {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    res.setHeader('Content-Type', 'text/html');
    res.send('<h1>PrPose</h1>')
})

router.route('/login')
    .get((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        if (!req.session.isLoggedIn){
            res.setHeader('Content-type', 'text/html');
            res.sendFile(path.join(__dirname, '/../login.html'));
        }
        else{
            res.redirect('/')
        }
    })
    .post((req, res, next) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        var username = req.body.username;
        var password = req.body.password;        
        if (username && password) {
            db.query('SELECT * FROM ?? WHERE username = ?', ["users", username], function (err, rows, fields) {
                if (rows.length > 0) {
                    var hash = rows.map( row => {
                        return row.password
                    })
                    //console.log(userHash[0])
                    bcrypt.compare(password, hash[0]).then((result) => {
                        if (result) {
                            req.session.username = username;
                            req.session.isLoggedIn = true;
                            //console.log([req.session.username, req.session.isLoggedIn])
                            req.session.save((err) => {
                                // session saved
                                res.redirect('/')
                            })
                        }
                        else {
                            res.send('Incorrect Username and/or Password!');
                            //setTimeout(() => { res.redirect('/login'); }, 3000);
                        }
                    });
                } 
            });
        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
    })

router.route('/signup')
    .get((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        res.end()
    })
    .post((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        const user = req.body.username; const email = req.body.email; const psw = req.body.password; const age = req.body.age; const bio = req.body.biography;
        db.query('SELECT users.username FROM users WHERE users.username = ? OR users.email = ?', 
        [user, email], function(err, rows){
            if (err){
                res.sendStatus(500);
                res.end()
            } 
            else if (rows.length > 0){
                res.send('<p>Username/email already used.</p>');
            }
            else{
                const hash = bcrypt.hash(psw, BCRYPT_SALT_ROUNDS)
                db.query('INSERT INTO users(??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)',
                        ['username', 'email', 'password', 'age', 'biography', user, email, hash, age, bio], function (err, rows) {
                            if (err) {
                                console.log(err)
                                res.sendStatus(500);
                                res.end()
                            }
                            res.send('<p>Nice, you\'ve signed up. Welcome to PrPose.</p>')
                            //res.redirect('/');

                        })
        
            }
        })
        
        //res.end()
    }) 

router.get('/logout', (req, res) => {
    if (!req.session.isLoggedIn){
        res.redirect('/')
    }
    else{
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            res.redirect('/');
        });
    }
    
})


module.exports = router;