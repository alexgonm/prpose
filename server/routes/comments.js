const express = require('express');
const db = require('../database/db');
const router = express.Router();


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

// router.get('/comments/post/:postID', (req, res) =>{
//     console.log('method ', req.method);
//     console.log('path: ', req.route.path);
//     console.log('query: ', req.query);
//     db.query('SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.post_id = ?', 
//     ['comments', 'posts', req.params.postID], function(err, rows){
//         if (err){
//             res.sendStatus(500);
//             res.end()
//         }
//         res.json(rows)
//     })
// })


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


//getCommentChildren
router.get('comment/:commentID/comments', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('')
})


router.get('comment/:commentID/upvotes', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('SELECT count(comment_vote.*) FROM ??, ?? WHERE comments.comment_id = comment_vote.comment_id AND comments.comment_id = ? AND comment_vote.upvote = 1',
        ['comments', 'comment_vote', req.params.commentID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

router.get('comment/:commentID/downvotes', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('SELECT count(comment_vote.*) FROM ??, ?? WHERE comments.comment_id = comment_vote.comment_id AND comments.comment_id = ? AND comment_vote.upvote = 0',
        ['comments', 'comment_vote', req.params.commentID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

router.post('comment/:commentID/vote', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('INSERT INTO comment_vote(??, ??, ??) VALUES (?, ?, ?)',
        ['upvote', 'username', 'comment_id', req.body.upvote, req.body.loggedUser, req.body.commentID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })



})


router.post('/createComment', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('INSERT INTO ??(??, ??, ??) VALUES (?, ?, ?)',
        ['comments', 'username', 'post_id', 'content', req.body.loggedUser, req.body.commentPost, req.body.commentContent], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            console.log('commentID créé',rows.insertID)
            res.send(rows)
        })
})

router.post('/createChildComment', (req, res) => {
    console.log('method ', req.method);
    console.log('path: ', req.route.path);
    console.log('query: ', req.query);
    db.query('INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
        ['comments', 'username', 'post_id', 'comment_id_parent', 'content', req.body.loggedUser, req.body.commentPost, req.body.commentParent ,req.body.commentContent], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            console.log('commentID créé', rows.insertID)
            res.send(rows)
        })
})

module.exports = router;