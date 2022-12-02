const jwt = require("jsonwebtoken");
const { User } = require("../models");
const redisCli = require("../util/redis");
require("dotenv").config();

// 유저 인증에 실패하면 403 상태 코드를 반환한다.
module.exports = async (req, res, next) => {
  try {
    const { accesstoken, refreshtoken } = req.cookies;
    console.log(req.cookies);
    console.log(req.headers);

    //로그인 안한경우 익명 정보로 저장
    if (!accesstoken) {
      res.locals.user = { userKey: 0, userId: "Anonymous" };
      return next();
    }

    /**유저 정보를 저장하고 다음 미들웨어 호출 */
    const nextMiddleware = async (token) => {
      const { userId } = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ where: { userId: userId } });
      res.locals.user = user;
      return next();
    };

    try {
      //accesstoken 검증 성공시 다음 미들웨어,실패시 refreshtoken검증
      jwt.verify(accesstoken, process.env.SECRET_KEY);
      nextMiddleware(accesstoken);
    } catch (error) {
      //refreshToken 검증 성공시 acesstoken재발급 후 다음미들웨어 호출
      const decoded = jwt.decode(accesstoken);
      const token = await redisCli.get(`${decoded.userId}`);
      if (refreshtoken === token) {
        jwt.verify(refreshtoken, process.env.SECRET_KEY);
        //accesstoken 재발급
        const newAccessToken = jwt.sign(
          { userId: decoded.userId, userKey: decoded.userKey },
          process.env.SECRET_KEY,
          {
            expiresIn: "30s",
          }
        );
        res.cookie("accesstoken", newAccessToken, {
          sameSite: "none",
          secure: true,
        });
        nextMiddleware(newAccessToken);
      } else {
        return res.status(403).json({ errMsg: "다시 로그인 해주세요." });
      }
    }
  } catch (error) {
    return res.status(403).json({ errMsg: "다시 로그인 해주세요." });
  }
};
