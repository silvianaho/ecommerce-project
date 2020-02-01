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
    allListingsFE: (callback) => {
        var sqlstring = "SELECT l.*, u.username FROM snapsell.listings AS l, snapsell.users AS u WHERE u.userid = l.fk_poster_id;";

        db.connection.query(sqlstring, [], (err, result) => {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    },

    searchListing: (queries, callback) => {
        var sqlstring = `
    SELECT
        *
    FROM
        snapsell.listings 
    WHERE
        title REGEXP(?) AND
        price >= ? AND
        price <= ? AND
        item_condition REGEXP(?) AND
        fk_category_id REGEXP(?) 
    LIMIT 
        ?, ?;`

        if (queries.title == "" || queries.title == undefined) {
            queries.title = ".*?"
        }
        if (queries.minprice == "" || queries.minprice == undefined) {
            queries.minprice = 0
        }
        if (queries.maxprice == "" || queries.maxprice == undefined) {
            queries.maxprice = 999999999999.99
        }
        if (queries.cond == "" || queries.cond == undefined) {
            queries.cond = ".*?"
        }
        if (queries.category == "" || queries.category == undefined) {
            queries.category = ".*?"
        }
        if (queries.lowerlimit == "" || queries.lowerlimit == undefined) {
            queries.lowerlimit = 0
        }
        if (queries.count == "" || queries.count == undefined) {
            queries.count = 10
        }

        let values = [
            queries.title,
            queries.minprice,
            queries.maxprice,
            queries.cond,
            queries.category,
            parseInt(queries.lowerlimit),
            parseInt(queries.count)
        ] 

        console.log(values)
        
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

    }
}

module.exports = listingsDB;