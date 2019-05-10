let express = require('express');
let db = require('../database/db');
let router = express.Router();


router.get('/themes', function (req, res) {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
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
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.query);
        db.query('SELECT * FROM ?? WHERE theme = ?', //'SELECT posts.* FROM ??, ?? WHERE themes.theme = posts.theme   AND themes.nom = ?', ['posts', 'themes', req.params.theme]
            ['themes', req.params.theme], function (err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows);
            })
    })

module.exports = router;