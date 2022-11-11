require("dotenv").config();
const express = require("express");
const fs = require("fs");
const HTTPS = require("https");

const connect = require("./schemas/index");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const indexRouter = require("./routes/index.routes");
const { errorLogger, errorHandler } = require("./exceptions/error-handler");

const app = express();
const port = process.env.EXPRESS_PORT || 3000;

connect();

app.use(cors());

app.use(cookieParser());
app.use(express.json());

app.use("/", indexRouter);

app.use(errorLogger); // Error Logger
app.use(errorHandler); // Error Handler

if (process.env.NODE_ENV == "production") {
  try {
    const option = {
      ca: fs.readFileSync(
        `/etc/letsencrypt/live/${process.env.BACK_URL}/fullchain.pem`
      ),
      key: fs.readFileSync(
        `/etc/letsencrypt/live/${process.env.BACK_URL}/privkey.pem`
      ),
      cert: fs.readFileSync(
        `/etc/letsencrypt/live/${process.env.BACK_URL}/cert.pem`
      ),
    };
    HTTPS.createServer(option, app).listen(port, () => {
      console.log("HTTPS 서버가 실행되었습니다. 포트 :: " + port);
    });
  } catch (error) {
    console.log("HTTPS 서버가 실행되지 않습니다.");
    console.log(error);
  }
} else if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log("HTTP 서버가 실행되었습니다. 포트 :: " + port);
  });
}
