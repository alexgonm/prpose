const express = require('express');
const db = require('../database/db');
const path = require('path');
const bcrypt = require('bcrypt');
const router = express.Router();

const BCRYPT_SALT_ROUNDS = 10;


router.get('/', function (req, res) {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    //res.setHeader('Content-Type', 'text/html');
    res.sendStatus(200)
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
                    //console.log(hash[0])
                    bcrypt.compare(password, hash[0]).then((result) => {
                        if (result) {
                            req.session.username = username;
                            req.session.isLoggedIn = true;
                            //console.log([req.session.username, req.session.isLoggedIn])
                            req.session.save((err) => {
                                // session saved
                                res.sendStatus(200)
                            })
                        }
                        else {
                            res.sendStatus(401);
                            //setTimeout(() => { res.redirect('/login'); }, 3000);
                        }
                    });
                } 
            });
        } else {
            //res.send('Please enter Username and Password!');
            res.sendStatus(400);
        }
    })

router.route('/signup')
    .get((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        if (!req.session.isLoggedIn)
            res.sendStatus(200)
        else {
            res.sendStatus(403)
        }
    })
    .post((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        if (!req.session.isLoggedIn){
            const user = req.body.username; const email = req.body.email; const psw = req.body.password; const age = req.body.age; const bio = req.body.biography;
            db.query('SELECT users.username FROM users WHERE users.username = ? OR users.email = ?',
                [user, email], (err, rows) => {
                    if (err) {
                        res.sendStatus(500);
                        res.end()
                    }
                    else if (rows.length > 0) {
                        res.sendStatus(409)//('Username/email already used.');
                    }
                    else {
                        bcrypt.hash(psw, BCRYPT_SALT_ROUNDS).then(function (hash){
                            db.query('INSERT INTO ??(??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?)',
                                ['users', 'username', 'email', 'password', 'age', 'biography', user, email, hash, age, bio], function (err, rows) {
                                    if (err) {
                                        console.log(err)
                                        res.sendStatus(500);
                                    }
                                    res.sendStatus(200);//('Nice, you\'ve signed up. Welcome to PrPose.')
                                    //res.redirect('/');
                                })

                        })
                        
                    }
                })
        }
        else {
            res.sendStatus(403)
        }
        
        
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