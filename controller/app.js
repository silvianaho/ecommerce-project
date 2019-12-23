/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const users = require('../model/users');
const listings = require('../model/listings');
const offers = require('../model/offers');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

app.use(urlencodedParser);
app.use(jsonParser);


// 1. get all users
app.get('/users', (req, res) => {
    users.allUsers((err, result) => {
        if (!err) {
            res.status(200).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 2. create a new user
app.post('/users', (req, res) => {
    var data = {
        username: req.body.username,
        profile_pic_url: req.body.profile_pic_url,
    }

    users.addUser(data, (err, result) => {
        if (!err) {
            var output = {
                "userID": result.insertId
            }
            res.status(201).type("json").send(JSON.stringify(output));
        } else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 3. get user by id
app.get('/users/:id', (req, res) => {
    var id = req.params.id;
    users.findUserbyID(id, (err, result) => {
        if (!err) {
            res.status(200).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 4. update user
app.put('/users/:id', (req, res) => {
    var data = {
        username: req.body.username,
        profile_pic_url: req.body.profile_pic_url,
        userid: req.params.id,
    };

    users.updateUser(data, (err, result) => {
        if (!err) {
            res.status(204).type("json").send(JSON.stringify(result));
        }
        else {
            if (err.errno === 1062) {
                res.status(422).type("json").send(JSON.stringify(err));
            } else {
                res.status(500).type("json").send(JSON.stringify(err));
            }
        }
    })

});

// 5. get all listings by user


// 6. get all listings


// 7. get listings by listing id


// 8. add new listing


// 9. delete listing


// 10. update a listing


// 11. get all offers for a listing


// 12. add a new offer to a listing



module.exports = app;