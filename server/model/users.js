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
        var sqlstring = "UPDATE users SET username=?, email=?, password=?, profile_pic_url=? WHERE userid=?";

        usersDB.findUserbyID(data.userid, (err, result) => {
            if (data.username === "") {
                data.username = result[0].username;
            };
            if (data.email === "") {
                data.email = result[0].email;
            };
            if (data.password === "") {
                data.password = result[0].password;
            };
            if (data.profile_pic_url === "") {
                data.profile_pic_url = result[0].profile_pic_url;
            };
            
            var values = [
                data.username,
                data.email,
                data.password,
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
        })



    },

    // 5. Find user by email
    findUserbyEmail: (email, callback) => {
        var sqlstring = "SELECT * FROM users WHERE email=?";

        db.connection.query(sqlstring, email, (err, result) => {
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

module.exports = usersDB;