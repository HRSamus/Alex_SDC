const pool = require('../index')

module.exports.getReviews=(product_id,page,count,sort)=>{
  if (sort === 'newest') sort = 'order by rw.date desc';
  if (sort === 'helpful') sort = 'order by rw.helpfulness desc';
  if (sort === 'relevant') sort = 'order by rw.helpfulness desc, rw.date desc';

  const query = `
        select rw.id as review_id, rw.rating, rw.summary, rw.recommend, rw.response, rw.body, rw.date, rw.reviewer_name, rw.helpfulness,
          (
          select array_to_json(coalesce(array_agg(ph), array[]::record[]))
          from
            (
            select p.id, p.url
            from reviews r
            inner join photos p
            on r.id = p.review_id
            where p.review_id = rw.id
            ) ph
          ) as photos
        from reviews rw
        where rw.product_id = ${product_id} and rw.reported <> true
        ${sort}
        limit ${count}
        offset ${count * page - count}
        ;`;

  return pool.connect().then((client) => {
    return client
      .query(query)
      .then((res) => {
        client.release();
        return res;
      })
      .catch((err) => {
        client.release();
        return err;
      });
  });

}