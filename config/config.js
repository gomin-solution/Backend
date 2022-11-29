require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_END_POINT,
    port: process.env.DB_PORT,
    dialect: "mysql",
    timezone: "Asia/Seoul",
  },
  // test: {
  //   username: "root",
  //   password: "dnflskfk1!",
  //   database: "database_test",
  //   host: "express-database.cseucwztvybj.ap-northeast-2.rds.amazonaws.com",
  //   dialect: "mysql",
  // },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_END_POINT,
    port: process.env.DB_PORT,
    dialect: "mysql",
    timezone: "Asia/Seoul",
  },
};
