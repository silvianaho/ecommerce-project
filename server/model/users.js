/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

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
        var sqlstring = `INSERT INTO users (username, email) VALUES (?, ?)`;
        var values = [
            data.username,
            data.email,
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
    // Extra: insert password to another table
    insertPwd: (data, callback) => {
        var sqlstring = `INSERT INTO usercreds (userid, email, password) VALUES (?, ?, ?)`;
        var values = [
            data.userid,
            data.email,
            data.password];

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

    // Extra: get user credentials from usercreds table by id
    findUserbyIDcreds: (id, callback) => {
        var sqlstring = "SELECT * FROM usercreds WHERE userid=?";
        
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
    
    // Extra: get userinfo from users table by username (case sensitive, absolute)
    findUserbyUsername: (username, callback) => {
        var sqlstring = "SELECT * FROM users WHERE username=?";

        db.connection.query(sqlstring, username, (err, result) => {
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
        var sqlstring = "UPDATE users SET username=?, email=?, profile_pic_url=? WHERE userid=?";

        usersDB.findUserbyID(data.userid, (err, result) => {
            if (data.username === "") {
                data.username = result[0].username;
            };
            if (data.email === "") {
                data.email = result[0].email;
            };
            if (data.profile_pic_url === "") {
                data.profile_pic_url = result[0].profile_pic_url;
            };

            var values = [
                data.username,
                data.email,
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

    // Extra: update user credentials
    updateCreds: (data, callback) => {
        var sqlstring = "UPDATE usercreds SET email=?, password=? WHERE userid=?";

        usersDB.findUserbyIDcreds(data.userid, (err, result) => {
            if (data.email === "") {
                data.email = result[0].email;
            };
            if (data.password === "") {
                data.password = result[0].password;
            };

            var values = [
                data.email,
                data.password,
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
        var sqlstring = "SELECT * FROM usercreds WHERE email=?";

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