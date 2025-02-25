/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const multer = require('multer');
const path = require('path');
const fs = require('fs')

const isLoggedInMiddleware = require('../isLoggedInMiddleware');
const users = require('../model/users');
const listings = require('../model/listings');
const offers = require('../model/offers');
const categories = require('../model/categories');
const likes = require('../model/likes');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
var jpgExtension = new RegExp(/(.*)\.jpg/i);

app.use(urlencodedParser);
app.use(jsonParser);
app.options('*', cors());
app.use(cors());

// Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../assets/uploads'))
    },
    filename: function (req, file, cb) {
        let fileExtension = file.originalname.split('.').pop()
        let name = file.fieldname + '-' + Date.now() + '.' + fileExtension
        cb(null, name)
    }
})

const fileFilter = (req, file, cb) => {
    if (!jpgExtension.test(file.originalname)) {
        const error = new Error("Incorrect file type");
        error.name = "INCORRECT_FILETYPE";
        return cb(error, false)
    }
    cb(null, true);

}

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 1000000
    }
})

// Endpoints //

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
        email: req.body.email,
        password: req.body.password,
        profile_pic_url: req.body.profile_pic_url
    }

    users.addUser(data, (err, result) => {
        if (err) {
            if (err.errno === 1062) {
                let output = {
                    err,
                    error: "This Username/Email is Taken.",
                }
                res.status(422).type("json").send(JSON.stringify(output));
            } else {
                res.status(500).type("json").send(JSON.stringify(err));
            }
        } else {
            var output = {
                "userID": result.insertId,
            }
            res.status(201).type("json").send(JSON.stringify(output));
        }
    })
});

// 3. get user by id
app.get('/users/:userid', (req, res) => {
    console.log("Servicing GET /users/:userid...");

    var userid = req.params.userid;
    users.findUserbyID(userid, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    error: "User does not exist."
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
app.put('/users/:userid/profile', isLoggedInMiddleware, (req, res) => {
    console.log("Servicing PUT /users/:userid/profile...");

    var data = {
        username: req.body.username,
        email: req.body.email,
        profile_pic_url: req.body.profile_pic_url,
        userid: req.params.userid,
    };

    users.updateUser(data, (err, result) => {
        if (!err) {
            res.status(204).type("json").send(JSON.stringify(result));
        }
        else {
            if (err.errno === 1062) {
                let output = {
                    err,
                    error: "This Username/Email is Taken.",
                }
                res.status(422).type("json").send(JSON.stringify(output));
            } else {
                res.status(500).type("json").send(JSON.stringify(err));
            }
        }
    })

});

// 5. update password
app.put('/users/:userid/pwd', isLoggedInMiddleware, (req, res) => {
    console.log("Servicing PUT /users/:userid/pwd...");

    var data = {
        password: req.body.password,
        userid: req.params.userid,
    };

    users.updatePwd(data, (err, result) => {
        if (!err) {
            res.status(204).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })

});

// 6. get all listings by user
app.get('/users/:userid/listings', (req, res) => {
    console.log("Servicing GET /users/:userid/listings...");

    var id = req.params.userid;

    users.findUserbyID(id, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    error: "User does not exist."
                }
                res.status(404).type("json").send(JSON.stringify(output));
                return;
            }
            else {
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
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
            return;
        }
    })
});

// 7. get all listings
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

// 8. get listings by listing id
app.get('/listings/:listingid', (req, res) => {
    console.log("Servicing GET /listings/:listingid...");

    var listingid = req.params.listingid;
    listings.findListingbyID(listingid, (err, result) => {
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

// 9. add new listing
app.post('/listings', isLoggedInMiddleware, upload.single('file'), (req, res) => {
    console.log("Servicing POST /listings...");

    var data = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        fk_poster_id: req.body.fk_poster_id,
        fk_category_id: req.body.fk_category_id,
        item_condition: req.body.item_condition,
        filename: req.file.filename,
        filesize: req.file.size,
        filetype: req.file.mimetype,
        fileencoding: req.file.encoding,
    }

    listings.addListing(data, (err, result) => {
        if (!err) {
            var output = {
                "listingID": result.insertId,
            }
            res.status(201).type("json").send(JSON.stringify(output));
        } else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 10. delete listing
app.delete('/listings/:listingid', isLoggedInMiddleware, (req, res) => {
    console.log("Servicing DELETE /listings/:listingid...");

    var listingid = req.params.listingid;
    let userid = req.decodedToken.userid

    listings.findListingbyID(listingid, (f_err, f_result) => {

        if (f_err) {
            res.status(500).type("json").send(JSON.stringify(f_err));
        } else {
            if (f_result == null) {
                let output = {
                    message: "Listing not found. Please provide a valid listingID"
                }
                res.status(400).type("json").send(JSON.stringify(output));
            } else if (f_result[0].fk_poster_id == userid) {
                listings.deleteListing(listingid, (err, result) => {
                    if (!err) {
                        res.status(204).type("json").send(JSON.stringify(result));
                    }
                    else {
                        res.status(500).type("json").send(JSON.stringify(err));
                    }
                })
            }
            else {
                let output = {
                    message: "Unauthorized [3]"
                }
                res.status(400).type("json").send(JSON.stringify(output));
            }
        }
    })
})

// 11. update a listing
app.put('/listings/:listingid', isLoggedInMiddleware, upload.single('file'), (req, res) => {
    console.log("Servicing PUT /listings/:listingid...");

    var data = {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        filename: req.file.filename,
        filesize: req.file.size,
        filetype: req.file.mimetype,
        fileencoding: req.file.encoding,
        listingid: req.params.listingid,
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

// 12. get all offers for a listing
app.get('/listings/:listingid/offers', (req, res) => {
    console.log("Servicing GET /listings/:listingid/offers...");

    var listingid = req.params.listingid;

    offers.getOffers(listingid, (err, result) => {
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

// 13. add a new offer to a listing
app.post('/listings/:listingid/offers', isLoggedInMiddleware, (req, res) => {
    console.log("Servicing POST /users...");

    var data = {
        offer: req.body.offer,
        fk_listing_id: req.params.listingid,
        fk_offerer_id: req.decodedToken.userid
    }
    let posterid = null

    listings.findListingbyID(data.fk_listing_id, (l_err, l_result) => {
        if (!l_err) {
            console.log(l_result);
            posterid = l_result[0].fk_poster_id
            console.log(posterid);

            if (req.decodedToken.userid == posterid) {
                let output = {
                    message: "You cannot post offer to your own listing"
                }
                res.status(500).type("json").send(JSON.stringify(output));
            } else {
                offers.addOffer(data, (err, result) => {
                    if (!err) {
                        var output = {
                            "offerID": result.insertId
                        }
                        res.status(201).type("json").send(JSON.stringify(output));
                    } else {
                        if (err.errno === 1452) {
                            let output = {
                                message: "ListingID or UserID does not exist, please provide valid values"
                            }
                            res.status(500).type("json").send(JSON.stringify(output));
                        } else {
                            res.status(500).type("json").send(JSON.stringify(err));
                        }
                    }
                })
            }
        }
        else {
            let output = {
                message: "ListingID or UserID does not exist, please provide valid values"
            }
            res.status(500).type("json").send(JSON.stringify(output));
        }
    })



});

// 14. Get all Categories
app.get('/categories', (req, res) => {
    console.log("Servicing GET /categories...");

    categories.getCategories((err, result) => {
        if (!err) {
            res.status(200).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

// 15. Login
app.post('/login', (req, res) => {
    console.log("Servicing POST /login...");
    var data = {
        username: req.body.username,
        password: req.body.password
    }

    users.verify(data, (err, result) => {
        if (err) {
            res.status(500).type("json").send(JSON.stringify(err));
        } else {
            if (result == null) {
                let output = {
                    error: "Wrong username/password. Please try again."
                }
                res.status(400).type("json").send(output);
            } else {
                const payload = { userid: result.userid };
                const options = {
                    algorithm: "HS256",
                    expiresIn: 3600
                };
                // @ts-ignore
                jwt.sign(payload, JWT_SECRET, options, function (error, token) {
                    if (error) {
                        console.log(error);
                        res.status(401).send(error);
                    } else {
                        console.log(result)
                        res.status(200).send({
                            token: token,
                            userid: result.userid
                        });
                    }
                })
            }
        }
    })
})

// 16. Get users that liked this item
app.get('/listings/:listingid/likes', (req, res) => {
    console.log("Servicing GET /listings/:listing_id/likes...");

    var listingid = req.params.listingid;

    likes.usersWhoLikedThis(listingid, (err, result) => {
        if (!err) {
            if (result == null) {
                let output = {
                    message: "Listing does not exist, please provide a valid listingID"
                }
                res.status(200).type("json").send(JSON.stringify(output));
            } else {
                if (result.length == 0) {
                    let output = {
                        message: "Nobody has liked this listing yet"
                    }
                    res.status(200).type("json").send(JSON.stringify(output));
                } else {
                    let output = {
                        likers: result,
                        likeCount: result.length
                    }
                    res.status(200).type("json").send(JSON.stringify(output));
                }
            }
        } else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

// 17. Get items liked by user
app.get('/users/:userid/likes', (req, res) => {
    console.log("Servicing GET /users/:userid/likes...");

    var userid = req.params.userid;

    likes.listingLikedByUser(userid, (err, result) => {
        if (!err) {
            if (result == null) {
                let output = {
                    message: "User does not exist, please provide a valid userID"
                }
                res.status(400).type("json").send(JSON.stringify(output));
            } else {
                if (result.length == 0) {
                    let output = {
                        message: "This user has not liked any listing yet"
                    }
                    res.status(400).type("json").send(JSON.stringify(output));

                } else {
                    res.status(200).type("json").send(JSON.stringify(result));
                }
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })

})

// 18. Like a listing
app.post('/listings/:listingid/likes', isLoggedInMiddleware, (req, res) => {
    console.log("Servicing POST /listings/:listingid/likes...");

    var data = {
        listingid: req.params.listingid,
        userid: req.body.userid
    }

    likes.likeAListing(data, (err, result) => {
        if (!err) {
            res.status(204).type("json").send(JSON.stringify(result));
        } else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 19. Unlike a listing
app.delete('/listings/:listingid/likes', isLoggedInMiddleware, (req, res) => {
    console.log("Servicing DELETE /listings/:listingid/likes...");

    var data = {
        listingid: req.params.listingid,
        userid: req.body.userid
    }

    likes.unlikeAListing(data, (err, result) => {
        if (!err) {
            res.status(204).type("json").send(JSON.stringify(result));
        } else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 20. get user by username
app.get('/profile/:username', (req, res) => {
    console.log("Servicing GET /user/:username...");

    var username = req.params.username;

    users.findUserbyUsername(username, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    error: "User does not exist."
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

// 21. get a picture
app.get('/listings/:listingid/picture', (req, res) => {
    console.log("Servicing GET /listings/:listingid/picture...");
    let id = req.params.listingid;

    listings.pictureById(id, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    "message": "Listing does not exist."
                }
                res.status(404).type("json").send(JSON.stringify(output));
            } else {
                let imagename = result[0].filename;
                let imageStream = fs.createReadStream(`./assets/uploads/${imagename}`)
                res.contentType('image/jpg');
                imageStream.pipe(res);

                // 2nd method:
                // let filepath = path.join(__dirname, "../assets/uploads", result[0].filename)                
                // res.status(200).contentType("jpg").sendFile(filepath)
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
});

// 22. Listings for Front End (Loggedin user)
app.get('/fe/:userid/listings', isLoggedInMiddleware, (req, res) => {
    console.log("Servicing GET /:userid/fe/listings...");

    let data = {
        lowerlimit: req.query.lowerlimit,
        count: req.query.count,
        userid: req.params.userid,
    }


    if (data.lowerlimit == "" || data.lowerlimit == undefined || isNaN(parseInt(data.lowerlimit))) {
        data.lowerlimit = 0
    }
    if (data.count == "" || data.count == undefined || isNaN(parseInt(data.count))) {
        data.count = 12
    }

    listings.allListingsFE(data, (l_err, l_result) => {
        likes.listingLikedByUser(data.userid, (ul_err, ul_result) => {
            if (!l_err || !ul_err) {
                for (const item of l_result) {
                    for (const liked of ul_result) {
                        if (item.listingsid === liked.listingsid) {
                            item.liked = true
                        }
                    }
                }
                res.status(200).type("json").send(l_result)
            }
            else {
                let output = {
                    l_err,
                    ul_err
                }
                res.status(500).type("json").send(output)
            }
        })

    })
})

// 23. Listings for Front End (Loggedout user)
app.get('/fe/listings', (req, res) => {
    console.log("Servicing GET /fe/listings...");
    let data = {
        lowerlimit: req.query.lowerlimit,
        count: req.query.count,
    }

    if (data.lowerlimit == "" || data.lowerlimit == undefined || isNaN(parseInt(data.lowerlimit))) {
        data.lowerlimit = 0
    }
    if (data.count == "" || data.count == undefined || isNaN(parseInt(data.count))) {
        data.count = 12
    }

    listings.allListingsFE(data, (err, result) => {
        if (!err) {
            console.log(result.length)
            res.status(200).type("json").send(result)
        } else {
            res.status(500).type("json").send(err)
        }
    })

})

// 24. Get listings per category
app.get('/listings/category/:categoryid', (req, res) => {
    console.log("Servicing GET /listings/category/:categoryid...");

    var categoryid = req.params.categoryid;
    if (parseInt(categoryid) > 8) {
        var output = {
            error: "Category out of range. Please enter an integer between 1 and 8."
        }
        res.status(400).type("json").send(JSON.stringify(output));
        return;
    }
    categories.getListingsByCat(categoryid, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    error: "There is no listing in this category."
                }
                res.status(400).type("json").send(JSON.stringify(output));
            } else {
                res.status(200).type("json").send(JSON.stringify(result));
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

// 25. Search listings
app.get('/search/listings', (req, res) => {
    console.log("Servicing GET /search/listings...");
    let queries = {
        title: req.query.title,
        minprice: req.query.minprice,
        maxprice: req.query.maxprice,
        cond: req.query.cond,
        category: req.query.category,
        userid: req.query.userid,
        lowerlimit: req.query.lowerlimit,
        count: req.query.count,
    }

    // if no value is entered, set default (numeric data only)
    if (queries.minprice == "" || queries.minprice == undefined || isNaN(parseInt(queries.minprice))) {
        queries.minprice = 0
    }
    if (queries.maxprice == "" || queries.maxprice == undefined || isNaN(parseInt(queries.maxprice))) {
        queries.maxprice = 999999999999.99
    }
    if (queries.userid == "" || queries.userid == undefined || isNaN(parseInt(queries.userid))) {
        queries.userid = 0
    }
    if (queries.lowerlimit == "" || queries.lowerlimit == undefined || isNaN(parseInt(queries.lowerlimit))) {
        queries.lowerlimit = 0
    }
    if (queries.count == "" || queries.count == undefined || isNaN(parseInt(queries.count))) {
        queries.count = 2
    }

    // check if value is valid or not
    console.log(queries)
    if (queries.minprice < 0 || queries.minprice > queries.maxprice || isNaN(queries.minprice)) {
        res.status(400).type("json").send({ error: "Invalid min price value. Please enter a positive integer that is smaller than the max price" });
        return;
    }
    if (queries.maxprice < 0 || queries.minprice > queries.maxprice || isNaN(queries.maxprice)) {
        res.status(400).type("json").send({ error: "Invalid max price value. Please enter a positive integer that is larger than the min price" });
        return;
    }
    if (queries.cond != "New" && queries.cond != "Used" && queries.cond != "") {
        res.status(400).type("json").send({ error: "Invalid condition value. Please enter either 'New' or 'Used'" });
        return;
    }
    if (queries.category > 8 || queries.category < 0 || isNaN(queries.category)) {
        res.status(400).type("json").send({ error: "Invalid category value. Please enter a number from 1-8" });
        return;
    }

    listings.searchListing(queries, (err, result) => {
        if (!err) {
            res.status(200).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

app.use((err, req, res, next) => {
    if (err.name === "INCORRECT_FILETYPE") {
        let output = {
            error: "Only .jpg images are allowed"
        }
        res.status(422).type("json").send(output);
        return;
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        let output = {
            error: "Maximum file size allowed is 1MB."
        }
        res.status(422).type("json").send(output)
        return;

    }
})



module.exports = app;