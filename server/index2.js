require("dotenv").config();
const express = require('express');
const path = require("path");
const moment = require('moment')
const app = express();
const bodyParser = require('body-parser');
app.use(express.json());
// app.use(bodyParser.json());

const {getReviews} = require('../database/dataHelpler/getReviews');
const {getMeta} = require('../database/dataHelpler/getMeta');
const {putHelpful} = require('../database/dataHelpler/putHelpful');
const {postReview} = require('../database/dataHelpler/postReview');
const {reportReview} = require('../database/dataHelpler/reportReview');

app.use(express.static(path.join(__dirname, "../client/dist")));


app.get(`/reviews/`, (req, res) => {
  const productId = req.query.product_id;
  const page = req.query.page || 1;
  const count = req.query.count || 5;
  const sort = req.query.sort || 'relevant';

  getReviews(productId,page,count,sort)
            .then(result=>{
              result.rows.map(result=>{
               result.date=new Date(Number(result.date))
              })
              res.send({ productId: productId, page, count, results:result.rows});
            })
})

app.get('/reviews/meta/',async (req,res)=>{
  const productId = req.query.product_id;
  const result = await getMeta(productId)
  res.send(result)
})

app.post('/reviews/',(req,res)=>{
  postReview(req.body)
  res.status(201).send('ok')
})

app.put('/reviews/:review_id/helpful',(req,res)=>{
  putHelpful(req.params.review_id).then(result=>{
    res.status(200).send(result);
  })
})
app.put('/reviews/:review_id/report',(req,res)=>{
  reportReview(req.params.review_id).then(result=>{
    res.status(200).send('reported');
  })
})

app.listen(process.env.PORT);
console.log(`Listening at http://localhost:${process.env.PORT}`);
