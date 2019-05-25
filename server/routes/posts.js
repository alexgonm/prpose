const express = require('express');
const axios = require('axios');
const db = require('../database/db');
const router = express.Router();

const instance = axios.create({
    baseURL: 'https://api.uclassify.com/v1',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Token zdOP4kz6GcGQ'
    }
})

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
            'SELECT * FROM ?? WHERE posts.post_id = ?', //TODO: mettre
            ['posts', req.params.postID], function (err, rows) {
                if (err) {
                    res.sendStatus(500);
                    res.end()
                }
                res.json(rows)
            })
    })
    .put((req, res) =>{ //On ne prvoie pas d'autoriser la modification d'une publication pour garder le thème d'origine et ne pas avoir à le changer pour cette publication.
        // const method = req.method; const routePath = req.route.path; const query = req.query;
        // console.log({ method, routePath, query });
        // db.query(
        //     'UPDATE ?? SET ?? = ?  WHERE post_id = ?',
        //     ['posts', 'content', req.body.postContent, req.params.postID], function (err, rows) {
        //         if (err) {
        //             res.sendStatus(500);
        //             res.end()
        //         }
        //         res.json(rows)
        //     }
        // )
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

router.get('/post/:postID/themes', (req, res) => {
        const method = req.method; const routePath = req.route.path; const query = req.query;
        console.log({ method, routePath, query });
        db.query(
            'SELECT themes.* FROM ??, ??, ?? WHERE post_theme.post_id = posts.post_id AND themes.theme = post_theme.theme AND posts.post_id = ?', //TODO;mettre a jour
            ['posts', 'post_theme', 'themes', req.params.postID], function (err, rows) {
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
    //console.log('body: ', req.body)
    // if (req.session.isLoggedIn){
    //     db.query('INSERT INTO ??(??, ??, ??, ??) VALUES (?, ?, ?, ?)',
    //         ['posts', 'username', 'theme', 'title', 'content', req.session.username, req.body.postTheme, req.body.postTitle, req.body.postContent], function (err, rows, fields) {
    //             if (err) {
    //                 console.log(err)
    //                 res.sendStatus(500);
    //                 res.end;
    //             }
    //             console.log('postID créé: ', rows.insertID)
    //             res.send(rows)

    //         })
    // }
    // else{
    //     next()
    // }
    const contentToClassify = JSON.stringify({ texts: [req.body.postContent] })
    instance.post('/uclassify/topics/fr/classify', contentToClassify)
    .then((response) => {
        //console.log(response.data[0].classification);
        if (response.data[0].textCoverage >= 0.5){
            const categories = relevantCategories(response.data[0])
            console.log(categories)
        }
        else{
            res.sendStatus(500)
        }
        
    })
    .catch((error) => {
        console.log(error);
    });
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

//On veut prendre seulement les catégories qui sont pertinentes
function relevantCategories(data){
    //Remarque: possibilité de sort(function (a,b){return a.p > b.p;}) au lieu de passer par un Map
    var probaOfCategory = new Map([]);
    data.classification.forEach(category => {
        //console.log(`Name: ${category.className}, Confidence: ${category.p}`);
        probaOfCategory.set(category.p, category.className);
    });
    //On prend les probabilité, on les tri dans l'ordre décroissant
    const probabilities = Array.from(probaOfCategory.keys()).sort().reverse()
    
    //On supprime les probabilités qui ne sont pas assez grandes
    for(index = 1; index < probabilities.length; index++) {
        if (probabilities[0] - probabilities[index] > 0.08) {
            probabilities.splice(index, probabilities.length - index);
        }
    }
    return getCategories(probabilities, probaOfCategory)
}

function getCategories(probabilities, probabilitiesMap){
    const categories = []
    for(index = 0; index < probabilities.length; index++) {
        categories.push(probabilitiesMap.get(probabilities[index]))

    }
    return categories;
}

module.exports = router;