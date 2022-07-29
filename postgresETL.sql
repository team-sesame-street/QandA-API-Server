DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;
DROP TABLE IF EXISTS photos CASCADE;


--create product table
  -- placeholder columns to take in the data then drop
CREATE TABLE IF NOT EXISTS products
(
  product_id SERIAL primary key,
  temp1 text,
  temp2 text,
  temp3 text,
  temp4 text,
  temp5 text
);

--copy from product csv
\COPY products FROM 'product.csv' DELIMITER ',' CSV HEADER;
--drop extra columns as we only want the ID
ALTER TABLE products
DROP COLUMN temp1,
DROP COLUMN temp2,
DROP COLUMN temp3,
DROP COLUMN temp4,
DROP COLUMN temp5;

-- create questions table
  -- data is originally in epoch format in ms
CREATE TABLE IF NOT EXISTS questions
(
  question_id SERIAL primary key,
  product_id integer,
  question_body varchar,
  question_date double precision,
  asker_name varchar,
  asker_email varchar,
  reported boolean,
  question_helpfulness integer,
  foreign key (product_id) references products (product_id)
);
-- copy from the question csv
\COPY questions FROM 'questions.csv' DELIMITER ',' CSV HEADER;
-- turn epoch in ms into seconds
UPDATE questions SET question_date = question_date / 1000;
-- change the epoch in seconds into a date timestamp
ALTER TABLE questions
  ALTER question_date TYPE timestamp without time zone
      USING (to_timestamp(question_date) AT TIME ZONE 'UTC');

--create answers table
CREATE TABLE IF NOT EXISTS answers (
  answer_id SERIAL PRIMARY KEY,
  question_id integer,
  answer_body varchar,
  answer_date double precision,
  answerer_name varchar,
  answerer_email varchar,
  reported boolean,
  answer_helpfulness varchar,
  foreign key (question_id) references questions (question_id)
);

--copy from the csv
\COPY answers FROM 'answers.csv' DELIMITER ',' CSV HEADER;
--turn epoch in ms into seconds
UPDATE answers SET answer_date = answer_date / 1000;
--change epoch in seconds into a date timestamp
ALTER TABLE answers
  ALTER answer_date TYPE timestamp without time zone
    USING (to_timestamp(answer_date) AT TIME ZONE 'UTC');


-- create photos table
CREATE TABLE IF NOT EXISTS photos (
  photo_id SERIAL PRIMARY KEY,
  answer_id integer not null,
  url varchar,
  foreign key (answer_id) references answers (answer_id)
);

--copy from answer photos csv
\COPY photos FROM 'answers_photos.csv' DELIMITER ',' CSV HEADER;

--fix the serial sequences
SELECT setval('questions_question_id_seq', max(question_id)) FROM questions;
SELECT setval('answers_answer_id_seq', max(answer_id)) FROM answers;
SELECT setval('photos_photo_id_seq', max(photo_id)) FROM photos;
SELECT setval('products_product_id_seq', max(product_id)) FROM products;