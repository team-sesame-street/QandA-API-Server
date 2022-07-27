CREATE DATABASE qanda

USE qanda

CREATE TABLE products (
  product_id integer not null auto_increment,
  primary key (product_id)
);

CREATE TABLE questions (
  question_id integer not null auto_increment,
  product_id integer not null,
  question_body varchar,
  question_date date,
  asker_name varchar,
  question_helpfulness varchar,
  reported boolean,
  asker_email varchar,
  primary key (question_id),
  foreign key (product_id) references products (product_id)
);

CREATE TABLE answers (
  answer_id integer not null auto_increment,
  question_id integer not null,
  answer_body varchar,
  answer_date date,
  answerer_name varchar,
  answer_helpfulness varchar,
  answerer_email varchar,
  primary key (answer_id),
  foreign key (question_id) references questions (question_id)
);

CREATE TABLE photos (
  id integer not null auto_increment,
  answer_id integer not null,
  url varchar,
  primary key (id),
  foreign key (answer_id) references answers (answer_id)
)