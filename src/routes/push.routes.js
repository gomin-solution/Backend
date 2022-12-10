const express = require("express");
const router = express.Router();
const { User } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const admin = require("firebase-admin");
let serAccount = require("../config/firebase");

admin.initializeApp({
  credential: admin.credential.cert(serAccount),
});

// 디바이스 토큰 저장
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { userKey } = res.locals.user;
    const { deviceToken } = req.body;
    console.log(deviceToken);
    await User.update(
      { deviceToken: deviceToken },
      { where: { userKey: userKey } }
    );

    return res.status(200).json({
      msg: "토큰 저장 성공",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
