/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

if (process.env.NODE_ENV === "development") {
    require('dotenv').config({ path: ".env.development" });
}

const dbserver = require('./model/databaseConfig');
const app = require('./controller/app');

const hostname = process.env.HOST;
const port = process.env.PORT;

// @ts-ignore
app.listen(port, hostname, () => {
    console.log(`Server started at ${hostname}:${port}`);
})

var conn = dbserver.getConnection();
dbserver.connectNow(conn);