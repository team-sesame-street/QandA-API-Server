const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const db = require('./db.js');
const cors = require('cors');

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')))
app.use(
  cors({
    origin: '*'
  })
)

app.use(bodyParser.json());

//look into using fetch and offset in the query to work with the page and count params.
app.get('/qa/questions/:question_id/answers', (req, res) => {
  let count = req.query.count || 5;
  let page = req.query.page || 1;
  let pageOffset = (page -1) * count;
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


    FROM answers a WHERE a.question_id = ${req.params.question_id} AND a.reported = false
    OFFSET ${pageOffset} FETCH FIRST ${count} ROW ONLY`, [], (err, result) => {
      if (err) {
        console.log('error at index get questions',err)
        res.status(400);
        res.send(err)
      }
      //can create/modify the result object.
      let resObj = {};
      resObj.question = req.params.question_id.toString();
      resObj.page = req.query.page || 0;
      resObj.count = req.query.count || 5;
      resObj.results = result.rows;

      res.send(resObj)
    }
  )
})

app.get('/qa/questions/', (req,res) => {
  let count = req.query.count || 5;
  let page = req.query.page || 1;
  let pageOffset = (page -1) * count;
  db.query(
    `SELECT q.question_id,
    q.question_body,
    q.question_date,
    q.asker_name,
    q.question_helpfulness,
    q.reported,
    (SELECT COALESCE(json_object_agg(answers.id, row_to_json(answers)) FILTER (WHERE answers.id IS NOT NULL), '[]') FROM
    (SELECT
      a.answer_id id,
      a.answer_body body,
      a.answer_date date,
      a.answerer_name,
      a.answer_helpfulness helpfulness,
      (SELECT COALESCE(json_agg(json_build_object(
        'id', p.photo_id,
        'url', p.url
      )), '[]')
      FROM photos p WHERE p.answer_id = a.answer_id) photos
    FROM answers a WHERE a.question_id = q.question_id) answers ) answers
    FROM questions q WHERE product_id = ${req.query.product_id} AND q.reported = false
    OFFSET ${pageOffset} FETCH FIRST ${count} ROW ONLY`, [], (err, result) => {
    if (err) {
      console.log('error at index get questions',err)
      res.status(400);
      res.send(err)
    }
    //can create/modify the result object.
    // console.log(result.rows)
    let resObj = {};
    resObj.product_id = req.query.product_id.toString();
    resObj.results = result?.rows;

    res.send(resObj);
  })
})

app.post('/qa/questions', (req, res) => {
  console.log('post body', req.body);
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
    VALUES ($1, $2, $3, $4, $5, $6, $7)`, [req.body.product_id, req.body.body, timestamp, req.body.name, req.body.email, false, 0], (err, result) => {
      if (err) {
        console.log('error at index post question', err);
        res.status(400);
        res.send(err)
      }
      console.log('posted item', req.body.product_id, req.body.body, timestamp, req.body.name, req.body.email, false, 0)
      res.status(201);
      res.send();
    })
})

app.post('/qa/questions/:question_id/answers', (req, res) => {
  let timestamp = new Date().toISOString();
  if (req.body.photos) {
    db.query(`WITH ans AS (INSERT INTO answers (
      question_id,
      answer_body,
      answer_date,
      answerer_name,
      answerer_email,
      reported,
      answer_helpfulness
      ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING answer_id)
      INSERT INTO photos (
        answer_id,
        url
      ) VALUES ((SELECT answer_id FROM ans), unnest(cast($8 as text[]))
      )`,
      [req.params.question_id, req.body.body, timestamp, req.body.name, req.body.email, false, 0, req.body.photos],(err, result) => {
        if (err) {
          console.log('error at index post answer with photo', err);
          res.status(400);
          res.send(err)
        }
        console.log('posted answer with photos',req.params.question_id, req.body.body, timestamp, req.body.name, req.body.email, false, 0);
        res.status(201);
        res.send();
      })
  } else {
    db.query(`INSERT INTO answers (
      question_id,
      answer_body,
      answer_date,
      answerer_name,
      answerer_email,
      reported,
      answer_helpfulness
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [req.params.question_id, req.body.body, timestamp, req.body.name, req.body.email, false, 0], (err, result) => {
        if (err) {
          console.log('error at answer post no photo', err)
          res.status(400);
          res.send(err)
        }
        console.log('posted answer w/o photos', req.params.question_id, req.body.body, timestamp, req.body.name, req.body.email, false, 0);
        res.status(201);
        res.send();
      })
  }
})

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  db.query(`UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${req.params.question_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index put helpful', err);
      res.status(400);
      res.send(err)
    }
    console.log('updated question helpful', req.params.question_id);
    res.status(204);
    res.send(`updated question ${req.params.question_id}`);
  })
})

app.put('/qa/questions/:question_id/report', (req, res) => {
  db.query(`UPDATE questions SET reported = true WHERE question_id = ${req.params.question_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index put report', err);
      res.status(400);
      res.send(err)
    }
    console.log('updated question report', req.params.question_id);
    res.status(204);
    res.send();
  })
})

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  db.query(`UPDATE answers SET answer_helpfulness = answer_helpfulness + 1 WHERE answer_id = ${req.params.answer_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index put helpful answer', err);
      res.status(400);
      res.send(err)
    }
    console.log('updated answer helpful', req.params.answer_id);
    res.status(204);
    res.send(`updated question ${req.params.answer_id}`);
  })
})

app.put('/qa/answers/:answer_id/report', (req, res) => {
  db.query(`UPDATE answers SET reported = true WHERE answer_id = ${req.params.answer_id}`, [], (err, result) => {
    if (err) {
      console.log('error at index put report', err);
      res.status(400);
      res.send(err)
    }
    console.log('updated answer report', req.params.answer_id);
    res.status(204);
    res.send();
  })
})

app.get('/loaderio-9d117d7d004e3b575a1e99393251f76e', (req, res) => res.send('loaderio-9d117d7d004e3b575a1e99393251f76e'))

var port = process.env.PORT || 3000;

app.listen(port, () => {console.log(`Listening at http://localhost:${port}`)});
