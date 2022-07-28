CREATE DATABASE qanda;

\c qanda

CREATE TABLE products (
  product_id SERIAL PRIMARY KEY
);

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  product_id integer not null,
  question_body varchar,
  question_date date,
  asker_name varchar,
  question_helpfulness varchar,
  reported boolean,
  asker_email varchar,
  foreign key (product_id) references products (product_id)
);

CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY,
  question_id integer not null,
  answer_body varchar,
  answer_date date,
  answerer_name varchar,
  answer_helpfulness varchar,
  answerer_email varchar,
  foreign key (question_id) references questions (question_id)
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id integer not null,
  url varchar,
  foreign key (answer_id) references answers (answer_id)
);