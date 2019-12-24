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
    console.log("Servicing GET /users...");

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
    console.log("Servicing POST /users...");

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
    console.log("Servicing GET /users/:id...");

    var id = req.params.id;
    users.findUserbyID(id, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    "message": "User does not exist."
                }
                res.status(404).type("json").send(JSON.stringify(output));
            } else {
                res.status(200).type("json").send(JSON.stringify(result));
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 4. update user
app.put('/users/:id', (req, res) => {
    console.log("Servicing PUT /users/:id...");

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
app.get('/users/:user_id/listings', (req, res) => {
    console.log("Servicing GET /users/:user_id/listings...");

    var id = req.params.user_id;

    listings.getListingfromUser(id, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    "message": "This user does not have any listing."
                }
                res.status(200).type("json").send(JSON.stringify(output));
            } else {
                res.status(200).type("json").send(JSON.stringify(result));
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 6. get all listings
app.get('/listings', (req, res) => {
    console.log("Servicing GET /listings...");

    listings.allListings((err, result) => {
        if (!err) {
            res.status(200).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 7. get listings by listing id
app.get('/listings/:listing_id', (req, res) => {
    console.log("Servicing GET /users/:listing_id...");

    var listing_id = req.params.listing_id;
    listings.findListingbyID(listing_id, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    "message": "Listing does not exist."
                }
                res.status(404).type("json").send(JSON.stringify(output));
            } else {
                res.status(200).type("json").send(JSON.stringify(result));
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 8. add new listing
app.post('/listings', (req, res) => {
    console.log("Servicing POST /listings...");

    var data = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        fk_poster_id: req.body.fk_poster_id,
        category: req.body.category,
        discount: req.body.discount,
    }

    listings.addListing(data, (err, result) => {
        if (!err) {
            var output = {
                "listingID": result.insertId
            }
            res.status(201).type("json").send(JSON.stringify(output));
        } else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 9. delete listing
app.delete('/listings/:id', (req, res) => {
    console.log("Servicing DELETE /listings/:id...");

    var id = req.params.id;

    listings.deleteListing(id, (err, result) => {
        if (!err) {
            res.status(204).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

// 10. update a listing
app.put('/listings/:id', (req, res) => {
    console.log("Servicing PUT /listings/:id...");

    var data = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        fk_poster_id: req.body.fk_poster_id,
        category: req.body.category,
        discount: req.body.discount,
        listingsid: req.params.id
    }

    listings.updateListing(data, (err, result) => {
        if (!err) {
            res.status(204).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })

});

// 11. get all offers for a listing
app.get('/listings/:id/offers', (req, res) => {
    console.log("Servicing GET /listings/:id/offers...");

    var id = req.params.id;

    offers.getOffers(id, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    "message": "There is no offer for this listing."
                }
                res.status(200).type("json").send(JSON.stringify(output));
            } else {
                res.status(200).type("json").send(JSON.stringify(result));
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

// 12. add a new offer to a listing
app.post('/listings/:id/offers', (req, res) => {
    console.log("Servicing POST /users...");

    var data = {
        offer: req.body.offer,
        fk_listing_id: req.params.id,
        fk_offerer_id: req.body.fk_offerer_id
    }

    offers.addOffer(data, (err, result) => {
        if (!err) {
            var output = {
                "offerID": result.insertId
            }
            res.status(201).type("json").send(JSON.stringify(output));
        } else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});


module.exports = app;