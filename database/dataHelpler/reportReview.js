const pool = require('../index');

module.exports.reportReview = review_Id => {
  const query = ` UPDATE "reviews"
        SET "reported" = ${true}
        WHERE id = ${review_Id};`;

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
};
