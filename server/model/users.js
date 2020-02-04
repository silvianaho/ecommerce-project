/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

const db = require("./databaseConfig");
const bcrypt = require('bcryptjs');

const saltRounds = 10;

var usersDB = {
    // 1. get all users
    allUsers: (callback) => {
        var sqlstring = "SELECT userid, username, email, profile_pic_url, created_at, last_updated FROM users";

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
        var sqlstring = `INSERT INTO users (username, email, password, profile_pic_url) VALUES (?, ?, ?, ?)`;

        if (data.profile_pic_url == "" || data.profile_pic_url == undefined) {
            data.profile_pic_url = `https://cdn.shopify.com/s/files/1/1374/2665/products/9_794e62fa-b248-4c1e-b9e4-18284ed0af4d_600x.png?v=1566040568`
        }

        console.log(data.profile_pic_url)

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(data.password, salt, function (err, hash) {
                var values = [
                    data.username,
                    data.email,
                    hash,
                    data.profile_pic_url,
                ];

                db.connection.query(sqlstring, values, (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                })
            })
        })
    },

    // 3. get user by id
    findUserbyID: (id, callback) => {
        var sqlstring = "SELECT userid, username, email, profile_pic_url, created_at, last_updated FROM users WHERE userid=?";

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
    
    findUsernamebyID: (id, callback) => {
        var sqlstring = "SELECT username FROM users WHERE userid=?";

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
        var sqlstring = "SELECT userid, username, email, profile_pic_url, created_at, last_updated FROM users WHERE username=?";

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

    // 4.5 update password
    updatePwd: (data, callback) => {
        var sqlstring = "UPDATE users SET password=? WHERE userid=?";

        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(data.password, salt, function (err, hash) {
                var values = [
                    hash,
                ];

                db.connection.query(sqlstring, values, (err, result) => {
                    if (err) {
                        console.log(err);
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                })
            })
        })

    },

    // 5. Find user by email
    findUserbyEmail: (email, callback) => {
        var sqlstring = "SELECT userid, username, email, profile_pic_url, created_at, last_updated FROM usercreds WHERE email=?";

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

    verify: (data, callback) => {
        var sqlstring = "SELECT * from users WHERE username=?";
        
        var values = [
            data.username,
        ];
        
        db.connection.query(sqlstring, values, function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                if (result.length == 0) {
                    return callback(null, null)
                } else {
                    const user = result[0]
                    // data.password (provided by the user)
                    // user.password (from database)

                    bcrypt.compare(data.password, user.password, function (err, cmpResult) {
                        if (err) {
                            console.log(err);
                            return callback(err, null)
                        } else {
                            if (!cmpResult) {
                                // a. password dont match
                                return callback(null, null);
                            } else {
                                // b. match
                                // return user record
                                return callback(null, user);
                            }
                        }

                    })

                }
            }
        });
    },
};

module.exports = usersDB;