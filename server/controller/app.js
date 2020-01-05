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
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs')

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
app.use(cors());

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
        password: req.body.password
    }

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        data.password = hash
        users.addUser(data, (err, result) => {
            if (!err) {
                let cred = {
                    userid: result.insertId,
                    email: req.body.email,
                    password: hash,
                }
                users.insertPwd(cred, (pwderr, pwdresult) => {
                    if (!pwderr) {
                        var output = {
                            "userID": result.insertId,
                        }
                        res.status(201).type("json").send(JSON.stringify(output));
                    }
                    else {
                        res.status(500).type("json").send(JSON.stringify({ err, pwderr }));
                    }
                })
            } else {
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
app.put('/users/:userid', (req, res) => {
    console.log("Servicing PUT /users/:userid...");

    var data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profile_pic_url: req.body.profile_pic_url,
        userid: req.params.userid,
    };

    bcrypt.hash(req.body.password, 10, (err, hash) => {
        data.password = hash;
        users.updateUser(data, (err, result) => {
            if (!err) {
                let cred = {
                    userid: data.userid,
                    email: req.body.email,
                    password: hash,
                }
                users.updateCreds(cred, (pwderr, pwdresult) => {
                    if (!pwderr) {
                        res.status(204).type("json").send(JSON.stringify(result));
                    }
                    else {
                        res.status(500).type("json").send(JSON.stringify({ err, pwderr }));
                    }
                })
            }
            else {
                if (err.errno === 1062) {
                    res.status(422).type("json").send(JSON.stringify(err));
                } else {
                    res.status(500).type("json").send(JSON.stringify(err));
                }
            }
        })
    })

});

// 5. get all listings by user
app.get('/users/:userid/listings', (req, res) => {
    console.log("Servicing GET /users/:userid/listings...");

    var id = req.params.userid;

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

// 8. add new listing
app.post('/listings', upload.single('file'), (req, res) => {
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

// 9. delete listing
app.delete('/listings/:listingid', (req, res) => {
    console.log("Servicing DELETE /listings/:listingid...");

    var listingid = req.params.listingid;

    listings.deleteListing(listingid, (err, result) => {
        if (!err) {
            res.status(204).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

// 10. update a listing
app.put('/listings/:listingid', upload.single('file'), (req, res) => {
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

// 11. get all offers for a listing
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

// 12. add a new offer to a listing
app.post('/listings/:listingid/offers', (req, res) => {
    console.log("Servicing POST /users...");

    var data = {
        offer: req.body.offer,
        fk_listing_id: req.params.listingid,
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

// 13. Get all Categories
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

// 14. Login
app.post('/login', (req, res) => {
    console.log("Servicing POST /login...");
    var data = {
        email: req.body.email,
        password: req.body.password
    }

    users.findUserbyEmail(data.email, (err, result) => {
        if (!err) {
            if (!result) {
                var output = {
                    error: "User does not exist."
                }
                res.status(400).type("json").send(JSON.stringify(output));
            } else if (bcrypt.compareSync(data.password, result[0].password)) {
                let output = {
                    token: jwt.sign(data, process.env.SECRET_KEY, { expiresIn: 3600 }),
                    userid: result[0].userid
                }
                res.status(200).type("json").send(output);
            }
            else {
                let output = {
                    error: "Wrong password."
                }
                res.status(400).type("json").send(output);
            }
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })
})

// 15. Validate token
app.post('/validate', (req, res) => {
    console.log("Servicing POST /validate...");

    let token = req.headers.authorization;

    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    jwt.verify(token, process.env.SECRET_KEY, function (err, decodedToken) {
        if (!err) {
            let output = {
                "message": "User logged in."
            }
            res.status(200).type("json").send(output)

        } else {
            let output = { "message": "the current user is not logged in" }
            res.status(401).type("json").send(output)
        }
    })
})

// 16. Get users that liked this item
app.get('/listings/:listingid/likes', (req, res) => {
    console.log("Servicing GET /listings/:listing_id/likes...");

    var listingid = req.params.listingid;

    likes.usersWhoLikedThis(listingid, (err, result) => {
        if (!err) {
            let output = {
                likers: result,
                likeCount: result.length
            }
            res.status(200).type("json").send(JSON.stringify(output));
        }
        else {
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
            res.status(200).type("json").send(JSON.stringify(result));
        }
        else {
            res.status(500).type("json").send(JSON.stringify(err));
        }
    })

})

// 18. Like a listing
app.post('/listings/:listingid/likes', (req, res) => {
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
app.delete('/listings/:listingid/likes', (req, res) => {
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
app.get('/:userid/fe/listings', (req, res) => {
    console.log("Servicing GET /:userid/fe/listings...");

    let data = {
        userid: req.params.userid,
    }

    listings.allListingsFE((l_err, l_result) => {
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
    listings.allListingsFE((err, result) => {
        if (!err) {
            res.status(200).type("json").send(result)
        } else {
            res.status(500).type("json").send(err)
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