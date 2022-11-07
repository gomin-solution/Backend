const multer = require("multer");
//const multerS3 = require('multer-s3');
const multerS3 = require("multer-s3-transform");
const sharp = require("sharp");
const aws = require("aws-sdk");
const path = require('path');
require("dotenv").config();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_KEY_REGION,
});

// const fileName = Math.floor(Math.random() * 100000000).toString();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    shouldTransform: true,
    transforms: [
      {
        id: "resized",
        transform: function (req, file, cb) {
          cb(null, sharp().resize(1000)); //이미지 사이즈
        },
        key: function (req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, `adviceimage/${Date.now()}${ext}`);
        },
      },
    ],
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,

    // key: fileName
    // key: function (req, file, cb) {
    //   //cb(null, `${Date.now()}_${file.originalname}`);
    //   //cb(null, `${Date.now()}`);
    //   cb(null, Date.now().toString());
    // },
  }),
});

module.exports = upload;
