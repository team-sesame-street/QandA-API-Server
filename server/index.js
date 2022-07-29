const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const db = require('./db.js');

const app = express();

app.use(bodyParser.json());

//look into using fetch and offset in the query to work with the page and count params.
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
    (SELECT json_object_agg(answers.id, row_to_json(answers)) FROM
    (SELECT
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
    FROM answers a WHERE a.question_id = q.question_id) answers ) answers
    FROM questions q WHERE product_id = ${req.query.product_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index get questions',err)
    }
    //can create/modify the result object.
    console.log(result.rows)
    let resObj = {};
    resObj.product_id = req.query.product_id.toString();
    resObj.results = result.rows;

    res.send(resObj);
  })
})

app.post('/qa/questions', (req, res) => {
  console.log('post body', req.query);
  let timestamp = new Date().toISOString();
  console.log(timestamp);
  db.query(`INSERT INTO questions (
    product_id,
    question_body,
    question_date,
    asker_name,
    asker_email,
    reported,
    question_helpfulness)
    VALUES ($1, $2, $3, $4, $5, $6, $7)`, [req.query.product_id, req.query.body, timestamp, req.query.name, req.query.email, false, 0], (err, result) => {
      if (err) {
        console.log('error at index post question', err);
      }
      console.log('posted item', req.query.product_id, req.query.body, timestamp, req.query.name, req.query.email, false, 0)
      res.status(201);
      res.send();
    })
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  db.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${req.query.question_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index put helpful', err);
    }
    console.log('updated question helpful', req.query.question_id);
    res.status(204);
    res.send(`updated question ${req.query.question_id}`);
  })
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  db.query(`UPDATE questions SET reported = true WHERE question_id = ${req.query.question_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index put report', err);
    }
    console.log('updated question report', req.query.question_id);
    res.status(204);
    res.send();
  })
})

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  db.query(`UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE answer_id = ${req.query.answer_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index put helpful answer', err);
    }
    console.log('updated answer helpful', req.query.answer_id);
    res.status(204);
    res.send(`updated question ${req.query.answer_id}`);
  })
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  db.query(`UPDATE answers SET reported = true WHERE answer_id = ${req.query.answer_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index put report', err);
    }
    console.log('updated answer report', req.query.answer_id);
    res.status(204);
    res.send();
  })
})


var port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Listening at http://localhost:${port}`)});
