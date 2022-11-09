const pool = require('../index');

module.exports.putHelpful = review_Id => {
  const query = ` UPDATE "reviews"
        SET "helpfulness" = "helpfulness" + 1
        WHERE id = ${review_Id}
        RETURNING id,helpfulness`

  return pool.connect().then((client) => {
    return client
      .query(query)
      .then((res) => {
        client.release();
        return res.rows[0];
      })
      .catch((err) => {
        client.release();
        return err;
      });
  });
};
