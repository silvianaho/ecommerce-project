const db = require("./databaseConfig");

var usersDB = {
// 1. get all users
    allUsers: (callback) => {
        var sqlstring = "SELECT * FROM users";

        db.connection.query(sqlstring, [], (err, result) => {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        })
    },
// 2. create a new user
    addUser: (data, callback) => {

    },

// 3. get user by id
    findUserbyID: (id, callback) => {

    },
    
// 4. update user    
    updateUser: (data, callback) => {

    }
};

module.exports = usersDB;