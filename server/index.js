const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const db = require('./db.js');

const app = express();

app.use(bodyParser.json());

app.get('/qa/questions', (req,res) => {
  // base query here, $1 goes into the request parameters.
  db.query(`SELECT * FROM products WHERE product_id = $1`, [req.params.id], (err, result) => {
    if (err) {
      console.log('error at index get questions',err)
    }
    //can create/modify the result object.
    res.send(result.rows[0])
  })
})

var port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Listening at http://localhost:${port}`)});