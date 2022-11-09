const pool = require('../index')

module.exports.getMeta=async (product_id)=>{
  let result = {
    product_id:product_id,
    ratings:{},
    recommended:{},
    characteristics:{}
  }

  const query = `select rMain.product_id,
  (
  select jsonb_agg(outerC) from
    (
    SELECT json_object_agg(r2.rating,
      (
      SELECT count(r1.rating)
      FROM reviews r1
      WHERE r1.product_id = rMain.product_id AND r1.rating = r2.rating
      )
    ) AS counts
  FROM reviews r2
  WHERE r2.product_id = rMain.product_id
  GROUP BY r2.rating) as outerC) as ratings,
  (
  select jsonb_agg(outerRecommendCounts) from
    (
    SELECT json_object_agg(r4.recommend,
      (
      SELECT count(r3.recommend)
      FROM reviews r3
      WHERE r3.product_id = rMain.product_id AND r3.recommend = r4.recommend
      )
    ) AS recommendCounts
  FROM reviews r4
  WHERE r4.product_id = rMain.product_id
  GROUP BY r4.recommend) as outerRecommendCounts
  ) as recommended,
  (
  select array_to_json(array_agg(characteristicGroup)) from
    (
    select c.name, c.id, avg(cr.value) as value
    from "characteristics" c
    inner join characteristic_reviews cr
    on c.id = cr.characteristic_id
    where c.product_id = rMain.product_id
    group by c.id
    ) characteristicGroup
  ) as characteristics
from reviews rMain
where rMain.product_id = ${product_id}
group by rMain.product_id`

  let reviewData = await pool.connect().then((client) => {
    return client
      .query(query)
      .then((res) => {
        client.release();
        return res.rows[0];
      })
  });
  console.log(reviewData)
  if(reviewData===undefined){
    const query2 = `select c.id,c.name from characteristics c where c.product_id = ${product_id}`
     reviewData = await pool.connect().then((client) => {
      return client
        .query(query2)
        .then((res) => {
          client.release();
          console.log(res)
          return res.rows;
        })
    });
    reviewData.forEach(type=>result.characteristics[type.name]={id:type.id,value:0})
    return result
  }
  reviewData.ratings.forEach(rating=>result.ratings={...result.ratings,...rating.counts})
  reviewData.recommended.forEach(recommend=>result.recommended={...result.recommended,...recommend.recommendcounts})
  reviewData.characteristics.forEach(type=>result.characteristics[type.name]={id:type.id,value:type.value})

  return result
}