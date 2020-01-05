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
                console.log(err);
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
                console.log(err);
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
                console.log(err);
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
        var sqlstring = "INSERT INTO listings (title, description, price, fk_poster_id, fk_category_id, item_condition, filename, fileinfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        var values = [
            data.title,
            data.description,
            data.price,
            data.fk_poster_id,
            data.fk_category_id,
            data.item_condition,
            data.filename,
            data.fileinfo
        ];

        db.connection.query(sqlstring, values, (err, result) => {
            if (err) {
                console.log(err);
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
                console.log(err);
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
        var sqlstring = "UPDATE listings SET title=?, description=?, price=?, fk_category_id=?, filename=?, fileinfo=? WHERE listingsid=?";

        listingsDB.findListingbyID(data.listingsid, (err, result) => {
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
                data.category = result[0].category;
            };
            if (data.filename === "") {
                data.filename = result[0].filename;
            };
            if (data.fileinfo === "") {
                data.fileinfo = result[0].fileinfo;
            };

            var values = [
                data.title,
                data.description,
                data.price,
                data.category,
                data.listingsid,
                data.filename,
                data.fileinfo
            ];


            db.connection.query(sqlstring, values, (err, result) => {
                if (err) {
                    console.log(err);
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
                console.log(err);
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

};

module.exports = listingsDB;