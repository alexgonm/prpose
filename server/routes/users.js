const express = require('express');
const db = require('../database/db');
const router = express.Router();


router.get('/users', (req, res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
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
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
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
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
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
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
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
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
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