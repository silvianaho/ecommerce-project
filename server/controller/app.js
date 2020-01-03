/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const multer = require('multer')


const users = require('../model/users');
const listings = require('../model/listings');
const offers = require('../model/offers');
const categories = require('../model/categories');
const likes = require('../model/likes');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

app.use(urlencodedParser);
app.use(jsonParser);
app.use(cors());

const fileFilter = (req, file, callback) => {
    const allowedType = ["image/jpg"];
    if (!allowedType.includes(file.mimetype)) {
        const error = new Error("Incorrect file type");
        error.name = "INCORRECT_FILETYPE";
        callback(error, false)
    }
    else{
        callback(null, true);
    }

}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '/assets/uploads')
    },
    filename: function (req, file, cb) {
      console.log("file",file);  
      let fileExtension = file.originalname.split('.')[1]
      cb(null, file.fieldname + '-' + Date.now()+'.'+fileExtension)
    }
  })

const upload = multer({
    storage: storage,
    // fileFilter,
    // limits: {
    //     fileSize: 1000000
    // }
})

/* app.use((err, req, res, next) => {
    console.log("meow");
    if (err.code === "INCORRECT_FILETYPE") {
        console.log(err);

        let output = {
            error: "Only .jpg images are allowed"
        }
        res.status(422).type("json").send(output);
        return;
    }
    if (err.code === "LIMIT_FILE_SIZE") {
        let output = {
            error: "Maximum file size allowed is 1MB."
        }
        res.status(422).type("json").send(output)
        return;

    }
}) */

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
app.put('/users/:id', (req, res) => {
    console.log("Servicing PUT /users/:id...");

    var data = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profile_pic_url: req.body.profile_pic_url,
        userid: req.params.id,
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
    console.log("Servicing GET /listings/:listing_id...");

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
        fk_category_id: req.body.fk_category_id,
        item_condition: req.body.item_condition,
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
                token: jwt.sign(decodedToken, process.env.SECRET_KEY)
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
    console.log("Servicing POST /listings/:listingid/likes...");

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

app.post('/upload', upload.single('file'), (req, res) => {
    console.log("Servicing POST /upload...");

    if(req.file) {
        res.json(req.file);
    }
    else throw 'error';
})



module.exports = app;