require("dotenv").config();
const express = require("express");
const fs = require("fs");
const HTTPS = require("https");
const HTTP = require("http");
const helmet = require("helmet");

const connect = require("./schemas/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index.routes");
const schedule = require("./util/schedule");
const { errorLogger, errorHandler } = require("./exceptions/error-handler");

const app = express();
const port = process.env.EXPRESS_PORT || 3000;
const socket = require("./socket");

connect();
schedule();

const whitelist = [
  process.env.CLIENT_1,
  process.env.CLIENT_2,
  process.env.TEST_CLIENT,
  "http://localhost:3000",
  undefined,
]; //Thunder client 요청의 경우 undefined 허용

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      // 만일 whitelist 배열에 origin인자가 있을 경우
      callback(null, true); // cors 허용
    } else {
      callback(new Error("Not Allowed Origin!")); // cors 비허용
    }
  },
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가

app.use(cookieParser());
app.use(express.json());

app.use("/", indexRouter);

app.use(errorLogger); // Error Logger
app.use(errorHandler); // Error Handler

let server;

if (process.env.NODE_ENV == "production") {
  try {
    const option = {
      ca: fs.readFileSync(`${process.env.CA}`),
      key: fs.readFileSync(`${process.env.KEY}`),
      cert: fs.readFileSync(`${process.env.CERT}`),
    };
    server = HTTPS.createServer(option, app);
    server.listen(port, () => {
      console.log("HTTPS 서버가 실행되었습니다. 포트 :: " + port);
      socket(server);
    });
  } catch (error) {
    console.log("HTTPS 서버가 실행되지 않습니다.");
    console.log(error);
  }
} else if (process.env.NODE_ENV !== "test") {
  server = HTTP.createServer(app);
  server.listen(port, () => {
    console.log("HTTP 서버가 실행되었습니다. 포트 :: " + port);
    socket(server);
  });
}

module.exports = server;
