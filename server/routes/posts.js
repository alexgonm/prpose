let express = require('express');
let db = require('../database/db');
let router = express.Router();


router.get('/posts', (req, res) => {
    db.query(
        'SELECT * FROM posts',
        function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }

            var posts = rows.map((row) => {
                return
            })

            res.send(rows)
        }
    )
})

router.route('/post/:id_post') //post avec ses commentaires
    .get((req, res) => {

    })
    .post((req, res) =>{

    })
    .delete((req, res) =>{

    });

router.route('/post/:id_post/:id_comment') //post et le commentaire i
    .get((req, res) => {

    })
    .post((req, res) => {

    })
    .delete((req, res) => {

    });




module.exports = router;