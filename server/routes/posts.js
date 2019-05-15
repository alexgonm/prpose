const express = require('express');
const db = require('../database/db');
const router = express.Router();

//TODO: regler le probleme de session (il faut que ca soit bien l'utlisateur connecté qui puisse faire ca)

router.get('/posts', (req, res) => {
    //res.setHeader();
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query(
        'SELECT * FROM ??',
        ['posts'], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }

            res.send(rows)
        })
})

router.route('/post/:postID') //post avec ses commentaires
    .get((req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
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
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
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
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query('DELETE FROM ?? where posts.post_id = ?',
        ['posts', req.params.postID], function(err, rows){
            if (err){
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
    });

//Seulement les commentaires 'racine', ceux qui n'ont pas de parents
router.get('/post/:postID/comments', (req, res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('SELECT comments.* FROM ??, ?? WHERE posts.post_id = comments.post_id AND comments.comment_id_parent = NULL AND comments.post_id = ?',
        ['comments', 'posts', req.params.postID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end()
            }
            res.json(rows)
        })
})

// router.get('/post/:postID/vote',(req, res) => {
//     const method = req.method; const routePath = req.route.path; const query = req.query;
//     console.log({ method, routePath, query });
//     db.query('SELECT post_vote.* FROM ??, ??, ?? WHERE post_vote.username = users.username AND post_vote.post_id = posts.post_id AND post_vote.post_id = ? AND post_vote.username = ?',
//     ['posts', 'post_vote', 'users', req.params.postID, req.body.loggedUser], function(err, rows){
//         if(err){
//             res.sendStatus(500);
//             res.end()
//         }
//         res.json(rows)
//     })
// })

router.get('post/:postID/upvotes', (req, res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('SELECT count(post_vote.*) FROM ??, ?? WHERE posts.post_id = post_vote.post_id AND post_vote.post_id = ? AND post_vote.upvote = 1',
        ['posts','post_vote', req.params.postID], function(err, rows){
        if (err) {
            res.sendStatus(500);
            res.end;
        }
        res.send(rows)
    })
})

router.get('post/:postID/downvotes', (req, res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('SELECT count(post_vote.*) FROM ??, ?? WHERE posts.post_id = post_vote.post_id AND post_vote.post_id = ? AND post_vote.upvote = 0',
        ['posts', 'post_vote', req.params.postID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

router.post('post/:postID/upvote', (req, res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('INSERT INTO post_vote(??, ??, ??) VALUES (?, ?, ?)',
        ['upvote', 'username', 'post_id', 1, req.body.loggedUser, req.body.postID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

router.post('post/:postID/downvote', (req, res) => {
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('INSERT INTO post_vote(??, ??, ??) VALUES (?, ?, ?)',
        ['upvote', 'username', 'post_id', 0, req.body.loggedUser, req.body.postID], function (err, rows) {
            if (err) {
                res.sendStatus(500);
                res.end;
            }
            res.send(rows)
        })
})

router.post('/createPost', (req, res, next) => {//TODO: regler le probleme de session (il faut que ca soit bien l'utlisateur connecté qui puisse faire ca)
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    console.log('body: ', req.body)
    if (req.session.isLoggedIn){
        db.query('INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
            ['posts', 'username', 'theme', 'title', 'content', req.body.username, req.body.postTheme, req.body.postTitle, req.body.postContent], function (err, rows, fields) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500);
                    res.end;
                }
                console.log('postID créé: ', rows.insertID)
                res.send(rows)

            })
    }
    else{
        next()
    }
})

router.post('/createChildPost', (req, res) => { //TODO: regler le probleme de session (il faut que ca soit bien l'utlisateur connecté qui puisse faire ca)
    const method = req.method; const routePath = req.route.path; const query = req.query;
    console.log({ method, routePath, query });
    db.query('',
    [], function(err, rows){
        if (err) {
            res.sendStatus(500);
            res.end;
        }
        console.log('posttID créé: ', rows.insertID)
        res.send(rows)
    })
})

module.exports = router;