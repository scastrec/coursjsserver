import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import bodyParser from 'body-parser';
import express from 'express';

import * as userBusiness from './users/business.js';

var messages = [];
var users = [];

const JWT_SECRET = process.env.JWT_SECRET || "DUMMY_SECRET";

const jwtMW = jwt({
    secret: JWT_SECRET,
    algorithms: ['sha1', 'RS256', 'HS256'],
});

const ping = (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.end('pong');
}

const hello = (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    console.log('hello ' + req.param('name', null));
    res.end('hello ' + req.param('name', null));
}

/** User part **/
const signup = function (req, res) {
    var username = req.param('username', null);
    var pwd = req.param('password', null);
    var image = req.param('urlPhoto', null);
    console.log('signup ' + username);
    try {
        userBusiness.signup(username, pwd, image);
        res.status(200);
    } catch(e) {
        res.status(400);
    }
    res.send();
}

const signin = function (req, res) {
    var username = req.param('username', null);
    var pwd = req.param('password', null);
    console.log('signin ' + username);
    try {
        const user = userBusiness.signin(username, pwd);
        if (user) {
            res.json({
                success: true,
                jwt: jsonwebtoken.sign({
                    username: username,
                    user: user,
                }, JWT_SECRET, { expiresIn: 60 * 60 })
            });
        } else {
            res.status(401);
        }
    } catch (e) {
        console.log('Exception signin', e)
        res.status(400);
    }
    res.send();
}

const getUsers = function (req, res) {
    const u = users.filter(user => {
        return {
            username: user.username,
            urlPhoto: user.urlPhoto,
            date: user.date
        }
    })
    res.send(JSON.stringify(u));
}

/**
 * add a message
 */
const addMessage = function (req, res) {
    console.log('post message ' + JSON.stringify(req.body));
    var msg = req.body.message;
    var message = {
        id: tokens[token] + "_" + new Date().getTime(),
        username: tokens[token],
        date: new Date().getTime(),
        message: msg
    }
    messages.push(message);
    res.status(200);
    res.send();
}

/**
 * get all messages
 */
const getMessages = function (req, res) {
    res.status(200);
    res.send(JSON.stringify(messages));
}


/*
 * Handle 404.
 */
const notFound = (req, res, next) => {
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
};

const doc = (express.static('./html/docapi'));

const cors = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
}


export const configExpress = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors);
    app.use('/', doc);
    app.use(jwtMW.unless({
        path:
            ['/', '/ping', '/hello', '/signin', '/signup', '/img']
    }));
    app.use(function (err, req, res, next) {
        console.log("JWT error handler", err);
        if (err.name === 'UnauthorizedError') {
            res.status(401).send({ message: "invalid token" });
        } else {
            next();
        }
    });
    app.post('/ping', ping);
    app.get('/hello', hello);

    app.post('/signin', signin);
    app.post('/signup', signup);

    app.get('/users', jwtMW, getUsers);

    app.get('/messages', jwtMW, getMessages);
    app.post('/messages', jwtMW, addMessage);

    app.use(notFound);
}