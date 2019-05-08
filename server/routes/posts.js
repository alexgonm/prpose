let express = require('express');
let db = require('../database/db');
let bodyParser = require('body-parser');
let router = express.Router();


router.get('/posts', (req, res) => {
    //res.setHeader();
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query(
        'SELECT * FROM ??',
        ['posts'], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }

            var posts = rows.map((row) => {
                return
            })

            res.send(rows)
        })
})

router.route('/post/:postID') //post avec ses commentaires
    .get((req, res) => {
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.query);
        db.query(
            'SELECT * FROM ?? WHERE ??.post_id = ?',
            ['posts', 'posts', req.params.postID], function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }

                var posts = rows.map((row) => {
                    return
                })

                res.json(rows)
            })
    })
    .put((req, res) =>{
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.route.query);
        db.query(
            'UPDATE ?? SET ?? = ?  WHERE post_id = ?',
            ['posts', 'content', req.body.postContent, req.params.postID], function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }

                res.json(rows)
            }
        )
    })
    .delete((req, res) =>{
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.query);
        db.query('DELETE FROM ?? where posts.post_id = ?',
        ['posts', req.params.postID], function(err, rows){
            if (err){
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
    });

router.post('/createPost', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?)',
        ['posts', 'username', 'theme', 'title', 'content', req.body.username, req.body.postTheme, req.body.postTitle, req.body.postContent], function(err, rows){
        if (err) {
            res.sendStatus(500);
            res.end;
        }
        console.log(rows.insertID)
        res.send(rows)

    })
})

// router.route('/post/:postID/:commentID') //post et le commentaire i
//     .get((req, res) => {
//         db.query('SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.post_id = ? AND',
//             ['comments', 'posts', req.params.postID], function (err, rows) {
//                 if (err) {
//                     res.sendStatus(500);
//                     res.end()
//                 }
//                 res.json(rows)
//             })
//     })
//     .post((req, res) => {

//     })
//     .delete((req, res) => {

//     });




module.exports = router;