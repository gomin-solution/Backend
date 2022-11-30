const multer = require("multer");
const multerS3 = require("multer-s3-transform");
const aws = require("aws-sdk");
const path = require("path");
require("dotenv").config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_KEY_REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const randomNumber = Math.floor(Math.random()*10000)
      cb(null, `adviceimage/${Date.now()}_${randomNumber}${ext}`);
    },
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
});

module.exports = upload;
