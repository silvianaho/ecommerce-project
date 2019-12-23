/*
Name: Silviana
Student ID: p1939213
Course: DIT/FT/1B/14
*/

const express = require('express');
const app = express();

const bodyParser = require('body-parser');

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

app.use(urlencodedParser);
app.use(jsonParser);

module.exports = app;