const express = require('express');
const db = require('../database/db');
const router = express.Router();


router.get('/themes', function (req, res) {
    db.query('SELECT * from ??',
        ["themes"], (err, rows) => {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.json(rows);
        })
})

    .get('/theme/:theme', (req, res) => {
        db.query('SELECT * FROM ?? WHERE theme = ?', //'SELECT posts.* FROM ??, ??, ?? WHERE themes.theme = posts.theme AND themes.nom = ? AND posts.post_id = post_vote.post_id ORDER BY ()', ['posts', 'themes', 'post_vote', req.params.theme]
            ['themes', req.params.theme], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows);
            })
    })

    .get('/theme/:theme/posts', (req, res) => {
        db.query('SELECT posts.* FROM ??, ??, ?? WHERE post_theme.post_id = posts.post_id AND themes.theme = post_theme.theme AND post_theme.theme = ?', //'SELECT posts.* FROM ??, ??, ?? WHERE themes.theme = posts.theme AND themes.nom = ? AND posts.post_id = post_vote.post_id ORDER BY ()', ['posts', 'themes', 'post_vote', req.params.theme]
            ['posts', 'post_theme', 'themes', req.params.theme], (err, rows) => {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows);
            })
    })

    

module.exports = router;