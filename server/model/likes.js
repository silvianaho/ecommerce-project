/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

const db = require('./databaseConfig');
const users = require('./users');
const listings = require('./listings');


var likesDB = {
    getLikedListings: (callback) => {
        var sqlstring = "SELECT * FROM likes";

        db.connection.query(sqlstring, [], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    },
    usersWhoLikedThis: (id, callback) => {
        var sqlstring = `
            SELECT u.username, u.userid FROM
                likes AS lk,
                listings AS ls,
                users AS u
            WHERE 
                lk.fk_listing_id=? AND 
                ls.listingsid=lk.fk_listing_id AND
                u.userid = lk.fk_liker_id;`;

        listings.findListingbyID(id, (err, result) => {
            if (err) {
                return callback(err, null)
            } else {
                if (result == null) {
                    return callback(null, null)
                } else {
                    db.connection.query(sqlstring, id, (err, result) => {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })

                }
            }
        })
    },
    listingLikedByUser: (id, callback) => {
        var sqlstring = `
        SELECT 
            ls.*, u.username
        FROM
            likes AS lk,
            listings AS ls
        LEFT JOIN 
            users AS u
        ON 
            ls.fk_poster_id = u.userid
        WHERE 
            lk.fk_liker_id = ? AND 
            ls.listingsid = lk.fk_listing_id`

        users.findUserbyID(id, (err, result) => {
            if (err) {
                return callback(err, null)
            } else {
                if (result == null) {
                    return callback(null, null)
                } else {
                    db.connection.query(sqlstring, id, (err, result) => {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } else {
                            return callback(null, result);
                        }
                    })

                }
            }
        })
    },
    likeAListing: (data, callback) => {
        var sqlstring = "INSERT INTO likes (fk_listing_id, fk_liker_id) VALUES (?, ?)";
        var values = [
            data.listingid,
            data.userid
        ]

        db.connection.query(sqlstring, values, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    },
    unlikeAListing: (data, callback) => {
        var sqlstring = "DELETE FROM likes WHERE fk_listing_id=? AND fk_liker_id=?";
        var values = [
            data.listingid,
            data.userid
        ]

        db.connection.query(sqlstring, values, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    },
}

module.exports = likesDB;