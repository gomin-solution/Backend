const express = require("express");
const router = express.Router();
const { User } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const admin = require("firebase-admin");
let serAccount = require("../config/firebase");
const redisCli = require("../util/redis");

admin.initializeApp({
  credential: admin.credential.cert(serAccount),
});

// 디바이스 토큰 저장
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { userKey } = res.locals.user;
    const { deviceToken } = req.body;
    console.log("//////////////디바이스 토큰//////////");
    console.log(userKey);
    console.log(deviceToken);
    await User.update(
      { deviceToken: deviceToken },
      { where: { userKey: userKey } }
    );

    return res.status(200).json({
      msg: "토큰 저장 성공",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    const { userKey } = res.locals.user;
    const Alarms = await redisCli.lRange(`${userKey}_A`, 0, -1);

    const alarms = Alarms.map((alarm) => JSON.parse(alarm));
    return res.status(200).json({ alarms });
  } catch (error) {
    next(error);
  }
});

router.delete("/", authMiddleware, async (req, res, next) => {
  try {
    const { userKey } = res.locals.user;
    const { alarm } = req.body;
    console.log("//////push알람삭제");
    console.log(alarm);
    const Alarm = JSON.stringify(alarm);
    await redisCli.lRem(`${userKey}_A`, 1, `${Alarm}`);
    return res.status(200).json({ message: "알람삭제" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
