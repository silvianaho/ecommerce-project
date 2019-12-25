const db = require("./databaseConfig");

var offersDB = {
    // 11. get all offers for a listing
    getOffers: (id, callback) => {
        var sqlstring = `
        SELECT o.* FROM offers AS o, listings AS l
        WHERE l.listingsid = o.fk_listing_id AND
            o.fk_listing_id = ?`

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

    // 12. add a new offer to a listing
    addOffer: (data, callback) => {
        var values = [
            data.offer,
            data.fk_listing_id,
            data.fk_offerer_id
        ]
        var sqlstring = 'INSERT INTO offers (offer, fk_listing_id, fk_offerer_id) VALUES (?, ?, ?)';

        db.connection.query(sqlstring, values, (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    }

};

module.exports = offersDB;