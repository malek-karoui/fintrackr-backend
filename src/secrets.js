const dotenv = require("dotenv");
const process = require("process");

dotenv.config();

module.exports = {
  mysqlHost: process.env.MYSQL_HOST,
  mysqlUser: process.env.MYSQL_USER,
  mysqlPassword: process.env.MYSQL_PASSWORD,
  mysqlDatabase: process.env.MYSQL_DATABASE,
  jwtSecret: process.env.JWT_SECRET,
};
