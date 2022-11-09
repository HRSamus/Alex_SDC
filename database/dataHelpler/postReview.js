const pool = require('../index');

module.exports.postReview = async ({product_id, rating, summary, body, recommend, name, email, photos, characteristics}) => {


  const date = Math.round((new Date()).getTime());

  const query1 = ` INSERT INTO "reviews"
        ("product_id", "rating", "date", "summary", "body", "recommend", "reviewer_name", "reviewer_email", "helpfulness")
        VALUES
        (${product_id}, ${rating}, ${date}, '${summary}', '${body}', ${recommend}, '${name}', '${email}', 0)
        RETURNING id;`;

  const review_Id = await pool.connect().then((client) => {
    return client
      .query(query1)
      .then((res) => {
        client.release();
        return res.rows[0].id;
      })
      .catch((err) => {
        client.release();
        return err;
      });
  });


  if(photos.length>0){
    photos.forEach(async photo=>{
      const query = `INSERT INTO photos ("review_id","url")
      VALUES
      (${review_Id},'${photo}')
      RETURNING id`;

      const result = await pool.connect().then((client) => {
        return client
          .query(query)
          .then((res) => {
            client.release();
            return res;
          })
          .catch((err) => {
            client.release();
            console.log('DB INSERT ERROR: ', err);
          });
        });
    })
  }

  for(var k in characteristics){
    const query = ` INSERT INTO characteristic_reviews (review_id, characteristic_id, value)
    VALUES (${review_Id},${k},${characteristics[k]})
    RETURNING id`;

      const cResult = await pool.connect().then((client) => {
      return client
        .query(query)
        .then((res) => {
          client.release();
          return res;
        })
        .catch((err) => {
          client.release();
          console.log('DB INSERT ERROR: ', err);
        });
      });
  }

  return
};
