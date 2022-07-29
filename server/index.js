const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const db = require('./db.js');

const app = express();

app.use(bodyParser.json());

app.get('/qa/questions/:question_id/answers', (req, res) => {
  db.query(
    `SELECT
      a.answer_id,
      a.answer_body body,
      a.answer_date date,
      a.answerer_name,
      a.answer_helpfulness helpfulness,
      (SELECT json_agg(json_build_object(
        'id', p.photo_id,
        'url', p.url
      ))
      FROM photos p WHERE p.answer_id = a.answer_id) photos


    FROM answers a WHERE a.question_id = ${req.query.question_id}`, [], (err, result) => {
      if (err) {
        console.log('error at index get questions',err)
      }
      //can create/modify the result object.
      console.log(result)
      let resObj = {};
      resObj.question = req.query.question_id.toString();
      resObj.page = req.query.page || 0;
      resObj.count = req.query.count || 5;
      resObj.results = result.rows;

      res.send(resObj)
    }
  )
})

app.get('/qa/questions', (req,res) => {
  db.query(
    `SELECT q.question_id,
    q.question_body,
    q.question_date,
    q.asker_name,
    q.question_helpfulness,
    q.reported,

    (SELECT json_agg(json_build_object(
      'id', a.answer_id,
      'body', a.answer_body,
      'date', a.answer_date,
      'answerer_name', a.answerer_name,
      'helpfulness', a.answer_helpfulness,
      'photos',
      (SELECT json_agg(json_build_object(
        'id', p.photo_id,
        'url', p.url
      ))
      FROM photos p WHERE p.answer_id = a.answer_id)
      ))

    FROM answers a WHERE a.question_id = q.question_id) answers
    FROM questions q WHERE product_id = ${req.query.product_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index get questions',err)
    }
    //can create/modify the result object.
    console.log(result.rows)
    let resObj = {};
    resObj.product_id = req.query.product_id.toString();
    resObj.results = result.rows;

    res.send(resObj)
  })
})

var port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Listening at http://localhost:${port}`)});

/*
    (SELECT json_object_agg(a.answer_id, row_to_json(answers)) FROM (
      SELECT
      a.answer_id id,
      a.answer_body body,
      a.answer_date date,
      a.answerer_name,
      a.answer_helpfulness helpfulness,
      (SELECT json_agg(json_build_object(
        'id', p.photo_id,
        'url', p.url
      ))
      FROM photos p WHERE p.answer_id = a.answer_id) photos
    ))

*/