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
        var sqlstring = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        var values = [
            data.username,
            data.email,
            data.password
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

    // 3. get user by id
    findUserbyID: (id, callback) => {
        var sqlstring = "SELECT * FROM users WHERE userid=?";

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

    // 4. update user    
    updateUser: (data, callback) => {
        var sqlstring = "UPDATE users SET username=?, profile_pic_url=? WHERE userid=?";
        // set default profile picture if field is empty 
        if (data.profile_pic_url === "") {
            data.profile_pic_url = "https://cutt.ly/MrqA7lB";
        };

        // trigger error if username field is an empty string
        // better to do it on the front end 
        if (data.username === "") {
            data.username = null;
        };

        var values = [
            data.username,
            data.profile_pic_url,
            data.userid
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
    }
};

module.exports = usersDB;