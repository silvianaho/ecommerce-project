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
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    }
}

module.exports = categoriesDB;