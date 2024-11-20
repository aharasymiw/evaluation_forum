"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg = require("pg");
let pool;
if (process.env.NEON_URL) {
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
    database: "toastmasters",
  });
}
module.exports = pool;
