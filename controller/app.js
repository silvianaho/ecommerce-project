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
app.get('/users', function (req, res) {
    users.allUsers((err, result) => {
        if (!err) {
            res.status(200).type("json").send(JSON.stringify(result));
        }
        else{
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

// 2. create a new user


// 3. get user by id


// 4. update user


// 5. get all listings by user


// 6. get all listings


// 7. get listings by listing id


// 8. add new listing


// 9. delete listing


// 10. update a listing


// 11. get all offers for a listing


// 12. add a new offer to a listing



module.exports = app;