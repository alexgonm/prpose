let express = require('express');
let db = require('../database/db');
let router = express.Router();


router.get('/themes', function (req, res) {
    db.query('SELECT * from ??',
        ["themes"], function (err, rows, fields) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.send(rows);
        })
})

.route('/theme/:theme')

    .get(function (req, res) {
        db.query('SELECT posts.* FROM ??, ?? WHERE themes.theme = posts.theme   AND themes.nom = ?',
            ['posts', 'themes', req.params.theme], function (err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.send(rows);
            })
    })

module.exports = router;