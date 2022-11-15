const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { Users } = require("../models");
require("dotenv").config();

// 카카오로그인
const kakaoCallback = (req, res, next) => {
  try {
    console.log("test");
    passport.authenticate(
      "kakao",
      { failureRedirect: "/login" }, // 실패하면 '/user/login''로 돌아감.
      async (err, user, info) => {
        if (err) return next(err);

        const { userId, nickname } = user;

        const accessToken = jwt.sign(
          { userId: userId },
          process.env.SECRET_KEY,
          { expiresIn: "3h" }
        );
        const refreshToken = jwt.sign(
          { userId: userId },
          process.env.SECRET_KEY,
          { expiresIn: "5h" }
        );
        await redisCli.set(userId, refreshToken);
        res.cookie("refreshToken", refreshToken);
        res.cookie("accessToken", accessToken);

        result = { userId, accessToken, refreshToken, nickname };
        res.status(200).json({
          message: "로그인 성공",
          accesstoken: accessToken,
          refreshtoken: refreshToken,
        });
        // res.redirect(
        //   `${process.env.FRONT_URL}@accesstoken=${accessToken}@refreshtoken=${refreshToken}`
        // );
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
};

router.get(
  "/kakao",
  passport.authenticate("kakao", {
    scope: ["profile_nickname", "profile_image", "account_email", "age_range"],
  })
);

router.get("/kakao/callback", kakaoCallback);

module.exports = router;
