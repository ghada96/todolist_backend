const express = require('express');
const routes = express.Router();
const bodyparser = require('body-parser')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
//import connection to mongodb

var { mongoose } = require('../bd/config');

var { User } = require('../models/user')

routes.use(bodyparser.json())


//override
routes.post('/subscribe', (req, res) => {
    //les donnes que je veux les recevoir du formulaire 
    var body = _.pick(req.body, ['firstname', 'lastname', 'email', 'password']);
    var user = new User(body)

    user.save().then(() => {
        res.status(200).send(user) // si user a été sauvegarder avec succes 
    }).catch((e) => {
        res.status(400).send(e)// sinon
    })

});

routes.post('/info', (req, res) => {
    let token = req.body.token;

    User.findOne({ 'tokens.token': token }).then((user) => {
        if (!user) {
            return res.status(404).send('user not found')
        }
        res.status(200).send(user)
    }).catch((e) => {
        res.status(400).send()
    })
});

routes.post('/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']) //
    var email = body.email;
    var password = body.password
    //User: model 
    User.findOne({ email }).then((user) => {
        if (!user) {
            res.status(400).send('email not found')
        }
        bcrypt.compare(password, user.password, (err, re) => {
            if (re) {
                //type de cnx (ex : admin , user ..) si il est declarer admin va nous donner l interface de admin ..
                var access = 'auth';
                //
                var token = jwt.sign({ _id: user._id.toHexString(), access }, 'secret').toString();
                user.tokens.push({ access, token })
                user.save().then(() => {
                    res.send(token)
                })
            } else {
                res.status(400).send('password incorrect')
            }
        })
    }).catch((e) => {
        res.status(400).send(e)
    })
});

routes.post('/logout', (req, res) => {
    let token = req.body.token;

    User.findOneAndUpdate({ 'tokens.token': token }, { 'tokens': '' }).then((user) => {
        if (!user) {
            return res.status(404).send('user not found');

        }

        res.status(200).send({ user })
    }).catch((e) => {
        res.status(400).send(e)
    })
});






routes.get('/', (req, res) => {
    res.send('welcome to user controller')
});
module.exports = routes;