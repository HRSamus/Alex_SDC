const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'ec2-18-188-60-79.us-east-2.compute.amazonaws.com',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'ubuntu',
  password: process.env.DB_PASSWORD || 'ubuntu',
  database: process.env.DB_NAME || 'sdc'
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})


module.exports = pool;