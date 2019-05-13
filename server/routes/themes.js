const express = require('express');
const db = require('../database/db');
const router = express.Router();


router.get('/themes', function (req, res) {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('SELECT * from ??',
        ["themes"], function (err, rows, fields) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.json(rows);
        })
})

.route('/theme/:theme')
    .get(function (req, res) {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query('SELECT * FROM ?? WHERE theme = ?', //'SELECT posts.* FROM ??, ??, ?? WHERE themes.theme = posts.theme AND themes.nom = ? AND posts.post_id = post_vote.post_id ORDER BY ()', ['posts', 'themes', 'post_vote', req.params.theme]
            ['themes', req.params.theme], function (err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows);
            })
    })

module.exports = router;