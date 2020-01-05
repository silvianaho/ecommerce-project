/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

const db = require('./databaseConfig');

var categoriesDB = {
    getCategories: (callback) => {
        var sqlstring = "SELECT * FROM categories";

        db.connection.query(sqlstring, [], (err, result) => {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    },
    getListingsByCat: (category, callback) => {
        var sqlstring = 'SELECT * FROM listings WHERE fk_category_id=?';

        db.connection.query(sqlstring, category, (err, result) => {
            if (!err) {
                if (!result) {
                    return callback(null, null)
                } else {
                    return callback(null, result)
                }
            } else {
                return callback(err, null)
            }
        })
    }
}

module.exports = categoriesDB;