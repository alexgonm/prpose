let express = require('express');
let db = require('../database/db');
let bodyParser = require('body-parser');
let router = express.Router();



router.get('/comments', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('SELECT * FROM ??',
    ['comments'], function (err, rows) {
        if (err){
            res.sendStatus(500);
            res.end()
        }
        res.json(rows)
    })
})

router.get('/comments/post/:postID', (req, res) =>{
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.post_id = ?', 
    ['comments', 'posts', req.params.postID], function(err, rows){
        if (err){
            res.sendStatus(500);
            res.end()
        }
        res.json(rows)
    })
})


router.route('/comment/:commentID')
    .get((req, res) => {
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.query);
        db.query('SELECT * FROM ?? WHERE comment_id = ?',
            ['comments', req.params.commentID], function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows)
            })
    })
    .put((req, res) => {
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.query);
        db.query('UPDATE ?? SET ?? = ? WHERE comment_id = ?',
            ['comments', 'content', req.body.commentContent, req.params.commentID], function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows)
            })
    })
    .delete((req, res) => {
        console.log('method ', req.method);
        console.log('path: ', req.route.path);
        console.log('query: ', req.query);
        db.query('DELETE FROM ?? WHERE comment_id = ?',
            ['comments', req.params.commentID], function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.send(rows)
            })
    });


router.post('/createComment', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
        ['comments', 'username', 'post_id', 'content', req.body.username, req.body.commentPost, req.body.commentContent], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.send(rows)
        })
})

router.post('/createChildComment', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
        ['comments', 'username', 'post_id', 'comment_id_parent', 'content', req.body.username, req.body.commentPost, req.body.commentParent ,req.body.commentContent], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.send(rows)
        })
})

module.exports = router;