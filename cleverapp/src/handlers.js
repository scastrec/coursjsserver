var jwt = require('express-jwt');
var bodyParser = require('body-parser');
var express = require('express');

var messages = [];
var notes = {};
var tokens = [];

var users = [];

const jwtMW = jwt({
    secret: process.env.JWT_SECRET || "DUMMY_SECRET",
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
    var pwd = req.param('pwd', null);
    var urlPhoto = req.param('urlPhoto', null);
    console.log('signup ' + username);
    if (!username || !pwd || username == 'undefined' || pwd == 'undefined') {
        res.status(400);
        res.send("error, username or pwd undefined");
    } else {
        var u = getUser(username);
        if (u) {
            res.status(401);
            res.send('user already exist');
            return;
        } else {
            var u = {
                username: username,
                urlPhoto: urlPhoto,
                pwd: pwd, //TODO hash
                date: new Date().getTime()
            }
            users.push(u);
            res.status(200);
            res.send();
        }
    }
}

const signin = function (req, res) {
    var username = req.param('username', null);
    var pwd = req.param('pwd', null);
    console.log('signin ' + username);
    if (!username || !pwd || username == 'undefined' || pwd == 'undefined') {
        console.log('signin username||pwd null' + username + ' || ' + pwd);
        res.status(400);
        res.send("error");
    } else {
        var u = getUser(username);
        if (!u || u.pwd != pwd) {
            console.log('signin username||pwd null' + username + ' || ' + pwd);
            res.status(401);
            res.send("error");
        } else {
            crypto.randomBytes(48, function (ex, buf) {
                var token = buf.toString('hex');
                tokens[token] = username;
                res.status(200);
                res.send('{"token":"' + token + '"}');
            });
        }
    }
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


/** Tchat part **/

/**
 * add a message
 */
const addNote = function (req, res) {
    console.log('post note ' + JSON.stringify(req.body));
    var msg = req.body.note;
    var name = tokens[token];
    var note = {
        id: name + "_" + new Date().getTime(),
        username: tokens[token],
        date: new Date().getTime(),
        note: msg,
        done: false
    }
    notes[note.id] = note;
    res.status(200);
    res.send(JSON.stringify(note));
}

const checkNote = function (req, res) {
    var id = req.params.id;
    console.log('update note ' + JSON.stringify(req.body));
    var done = req.body.done;
    if (id in notes) {
        var n = notes[id];
        n.done = done;
        notes[id] = n;
        res.status(200);
        res.send(JSON.stringify(n));
    } else {
        res.status(400);
        return;
    }
}



/**
 * get all messages
 */
const getNotes = function (req, res) {
    client.get(token, function (err, reply) {
        if (reply) {
            res.status(200);
            var output = [];

            for (var type in notes) {
                output.push(notes[type]);
            }
            res.send(JSON.stringify(output));
        } else {
            res.status(401);
            res.send('token invalid');
        }
    });
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


exports.configExpress = (app) => {
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

    app.get('/notes', jwtMW, getNotes);
    app.post('/notes', jwtMW, addNote);
    app.post('/notes/:id', jwtMW, checkNote);

    app.use(notFound);
}