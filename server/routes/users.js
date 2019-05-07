let express = require('express');
let db = require('../database/db');
let router = express.Router();


router.get('/login', (req, res) => {
    res.setHeader('Content-type', 'text/html');
    res.sendFile(path.join(__dirname + '/login.html'));
})

.get('/register', (req, res) =>{
    res.end()
})


.get('/users', (req, res) => {
    db.query(
        'SELECT users.??, users.?? FROM ??',
        ['username', 'age', 'users'], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }

            var users = rows.map((row) => {
                return
            })

            res.send(rows)
        }
    )
});

router.route('/user/:username')
    .get((req, res) => {
        db.query('SELECT users.??, users.?? FROM ?? WHERE users.username = ?',
            ['username', 'age', 'users', req.params.username], function (err, rows, fields) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.send(rows);
            })
    })
    .delete((req, res) => {

    });

router.route('/user/:username/posts')
    .get((req, res) => {

    })
    .delete((req, res) => {

    });


module.exports = router;