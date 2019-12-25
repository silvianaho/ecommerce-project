/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

require('dotenv').config()
const mysql = require('mysql');

const dbconnect = {
    connection: null,
    getConnection: function () {
        // get a connection to the db
        // @ts-ignore
        var conn = mysql.createConnection({
            host    : process.env.DB_HOST,
            port    : process.env.DB_PORT,
            user    : process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });
    
        this.connection = conn;
        // return the connection
        return conn;
    },
    connectNow: function (dbconnection) {
        dbconnection.connect(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Connected!");
            }
        });
    }
}

module.exports = dbconnect