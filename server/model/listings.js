/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

const db = require("./databaseConfig");

var listingsDB = {
    // 5. get all listings by user
    getListingfromUser: (id, callback) => {
        var sqlstring = `
        SELECT l.* FROM listings AS l, users as u
        WHERE u.userid = l.fk_poster_id AND
            l.fk_poster_id = ?`;

        db.connection.query(sqlstring, id, (err, result) => {
            if (err) {
                return callback(err, null);
            } else {
                if (result.length == 0) {
                    return callback(null, null);
                } else {
                    return callback(null, result);
                }
            }
        });
    },

    // 6. get all listings
    allListings: (callback) => {
        var sqlstring = "SELECT * FROM listings";

        db.connection.query(sqlstring, [], (err, result) => {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    },

    // 7. get listings by listing id
    findListingbyID: (id, callback) => {
        var sqlstring = "SELECT * FROM listings WHERE listingsid=?";

        db.connection.query(sqlstring, id, (err, result) => {
            if (err) {
                return callback(err, null);
            } else {
                if (result.length == 0) {
                    return callback(null, null);
                } else {
                    return callback(null, result);
                }
            }
        })
    },

    // 8. add new listing
    addListing: (data, callback) => {
        var sqlstring = "INSERT INTO listings (title, description, price, fk_poster_id, fk_category_id, item_condition, filename, filesize, filetype, fileencoding) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var values = [
            data.title,
            data.description,
            data.price,
            data.fk_poster_id,
            data.fk_category_id,
            data.item_condition,
            data.filename,
            data.filesize,
            data.filetype,
            data.fileencoding,
        ];

        db.connection.query(sqlstring, values, (err, result) => {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    },

    // 9. delete listing
    deleteListing: (id, callback) => {
        var sqlstring = "DELETE FROM listings WHERE listingsid=?";

        db.connection.query(sqlstring, id, (err, result) => {
            if (err) {
                return callback(err, null);
            } else {
                if (result.length == 0) {
                    return callback(null, null);
                } else {
                    return callback(null, result);
                }
            }
        })
    },

    // 10. update a listing
    updateListing: (data, callback) => {
        var sqlstring = "UPDATE listings SET title=?, description=?, price=?, fk_category_id=?, filename=?, filesize=?, filetype=?, fileencoding=? WHERE listingsid=?";

        listingsDB.findListingbyID(data.listingid, (err, result) => {
            if (data.title === "") {
                data.title = result[0].title;
            };
            if (data.description === "") {
                data.description = result[0].description;
            };
            if (data.price === "") {
                data.price = result[0].price;
            };
            if (data.category === "") {
                data.category = result[0].fk_category_id;
            };
            if (data.filename === "") {
                data.filename = result[0].filename;
            };
            if (data.filesize === "") {
                data.filesize = result[0].filesize;
            };
            if (data.filetype === "") {
                data.filetype = result[0].filetype;
            };
            if (data.fileencoding === "") {
                data.fileencoding = result[0].fileencoding;
            };

            var values = [
                data.title,
                data.description,
                data.price,
                data.category,
                data.filename,
                data.filesize,
                data.filetype,
                data.fileencoding,
                data.listingid,
            ];


            db.connection.query(sqlstring, values, (err, result) => {
                if (err) {
                    return callback(err, null);
                } else {
                    if (result.length == 0) {
                        return callback(null, null);
                    } else {
                        return callback(null, result);
                    }
                }
            })
        })
    },

    // Extra: get picture by ID
    pictureById: (id, callback) => {
        var sqlstring = "SELECT filename FROM listings WHERE listingsid=?";

        db.connection.query(sqlstring, [id], (err, result) => {
            if (err) {
                return callback(err, null);
            } else {
                if (result.length == 0) {
                    return callback(null, null);
                } else {
                    return callback(null, result);
                }
            }
        })
    },

    // for front end
    allListingsFE: (data, callback) => {
        var sqlstring = "SELECT l.*, u.username FROM snapsell.listings AS l, snapsell.users AS u WHERE u.userid = l.fk_poster_id LIMIT ?, ?;";
        let values = [
            parseInt(data.lowerlimit),
            parseInt(data.count)
        ]
        listingsDB.allListings((err, result) => {
            if (err) {
                return err;
            } else {
                // eol = end of listings
                let lastListing = result[result.length - 1].listingsid;
                db.connection.query(sqlstring, values, (feErr, feResult) => {
                    if (feErr) {
                        return callback(feErr, null);
                    } else {
                        if (feResult.length == 0) {
                            return callback(null, null);
                        } else {
                            feResult.forEach(listing => {
                                if (listing.listingsid == lastListing) {
                                    listing.eol = true;
                                } else {
                                    listing.eol = false;
                                }
                            });

                            return callback(null, feResult);
                        }
                    }
                })
            }

        })
    },

    allSearchResult: (queries, callback) => {
        var sqlstring = `
    SELECT
        ls.listingsid
    FROM
        listings AS ls,
        users AS u
    WHERE
        ls.title REGEXP(?) AND
        ls.price >= ? AND
        ls.price <= ? AND
        ls.item_condition REGEXP(?) AND
        ls.fk_category_id REGEXP(?) AND
        ls.fk_poster_id != ? AND
        ls.fk_poster_id = u.userid
    ORDER BY 
        ls.listingsid ASC
        `

        if (queries.title == "" || queries.title == undefined) {
            queries.title = ".*?"
        }
        if (queries.cond == "" || queries.cond == undefined) {
            queries.cond = ".*?"
        }
        if (queries.category == "" || queries.category == undefined) {
            queries.category = ".*?"
        }

        let values = [
            queries.title,
            queries.minprice,
            queries.maxprice,
            queries.cond,
            queries.category,
            parseInt(queries.userid),
        ]

        db.connection.query(sqlstring, values, (err, result) => {
            if (err) {
                console.log(err);
                
                return callback(err, null);
            } else {
                if (result == null) {
                    return callback(null, null);
                } else {
                    return callback(null, result);
                }
            }
        })
    },

    searchListing: (queries, callback) => {
        var sqlstring = `
    SELECT
        ls.*, 
        u.username
    FROM
        listings AS ls
    LEFT JOIN 
        users AS u
    ON 
        ls.fk_poster_id = u.userid
    WHERE
        ls.title REGEXP(?) AND
        ls.price >= ? AND
        ls.price <= ? AND
        ls.item_condition REGEXP(?) AND
        ls.fk_category_id REGEXP(?) AND
        ls.fk_poster_id != ?
    ORDER BY 
	    ls.listingsid ASC
    LIMIT 
        ?, ?;`

        if (queries.title == "" || queries.title == undefined) {
            queries.title = ".*?"
        }
        if (queries.cond == "" || queries.cond == undefined) {
            queries.cond = ".*?"
        }
        if (queries.category == "" || queries.category == undefined) {
            queries.category = ".*?"
        }

        let values = [
            queries.title,
            queries.minprice,
            queries.maxprice,
            queries.cond,
            queries.category,
            parseInt(queries.userid),
            parseInt(queries.lowerlimit),
            parseInt(queries.count)
        ]

        listingsDB.allSearchResult(queries, (err, result) => {            
            if (err) {
                return callback(err, null);
            } else {
                if (result.length == 0) {                    
                    return callback(null, null);
                } else {
                    let lastListing = result[result.length - 1].listingsid
                    
                    db.connection.query(sqlstring, values, (smallsearchErr, smallsearchResult) => {
                        if (smallsearchErr) {
                            return callback(smallsearchErr, null);
                        } else {
                            if (smallsearchResult.length == 0) {
                                return callback(null, null);
                            } else {
                                smallsearchResult.forEach(listing => {
                                    if (listing.listingsid == lastListing) {
                                        listing.eol = true;
                                    } else {
                                        listing.eol = false;
                                    }
                                });
                                return callback(null, smallsearchResult);
                            }
                        }
                    })
                }
            }
        })
    },

}

module.exports = listingsDB;