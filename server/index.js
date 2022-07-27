const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.use(bodyParser.json());

var port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Listening at http://localhost:${port}`)});