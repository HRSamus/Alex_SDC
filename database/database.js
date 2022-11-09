const { Client } = require('pg');


const connection = {
  host: 'localhost',
  port: 5432,
  database: 'SDC',
  user: 'postgres',
  password: '12341234'
};

const client = new Client(connection);

client.connect()

client.query(`CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id int,
  rating int,
  date timestamp,
  summary VARCHAR,
  body VARCHAR,
  recommend boolean,
  reported boolean,
  reviewer_name VARCHAR,
  reviewer_email VARCHAR,
  response VARCHAR,
  helpfulness int DEFAULT 0);`, (err, res) => {
    console.log(err ? err.stack : res.rows);
  })

client.query(`CREATE TABLE IF NOT EXISTS photos (
  id SERIAL PRIMARY KEY,
  url VARCHAR,
  review_id int);`, (err, res) => {
    console.log(err ? err.stack : res.rows);
  })

client.query(`CREATE TABLE IF NOT EXISTS characteristics (
  id SERIAL PRIMARY KEY,
  product_id int,
  name VARCHAR);`, (err, res) => {
    console.log(err ? err.stack : res.rows);
  })

client.query(`CREATE TABLE IF NOT EXISTS characteristics_reviews (
  id SERIAL PRIMARY KEY,
  review_id int,
  characteristics_id int,
  value int);`, (err, res) => {
    console.log(err ? err.stack : res.rows);
  })


