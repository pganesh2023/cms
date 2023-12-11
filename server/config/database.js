const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "cms.ck7jfv7qpwue.ap-south-1.rds.amazonaws.com",
  user: "admin",
  password: "password",
  port: "3306",
  database: "childcare_db",
  connectionLimit: 5,
});

module.exports = pool;
