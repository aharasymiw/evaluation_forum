const pg = require("pg");
let pool;
if (process.env.ENVIRONMENT === 'prod') {
  pool = new pg.Pool({
    connectionString: process.env.NEON_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}
else {
  pool = new pg.Pool({
    host: "localhost",
    port: 5432,
    database: "evaluation_forum",
  });
}
module.exports = pool;
