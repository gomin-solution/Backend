const jwt = require("jsonwebtoken");
const { User } = require("../models");
const redisCli = require("../util/redis");
require("dotenv").config();

// 유저 인증에 실패하면 403 상태 코드를 반환한다.
module.exports = async (req, res, next) => {
  try {
    // const accesstoken = req.headers.cookie.split(";")[0].split("=")[1];
    // const refreshtoken = req.headers.cookie.split(";")[1].split("=")[1];

    // console.log("////////여기///////////");
    // console.log("accesstoken:", accesstoken);
    // console.log("refreshtoken:", refreshtoken);
    // console.log(req.headers.cookie);
    const { accesstoken, refreshtoken } = req.cookies;
    console.log(req.cookies);
    console.log(req.headers);

    //로그인 안한경우 익명 정보로 저장
    if (!accesstoken) {
      res.locals.user = { userKey: 0, userId: "Anonymous" };
      return next();
    }

    /**AccessToken검증 */
    function validateAccessToken(accesstoken) {
      try {
        jwt.verify(accesstoken, process.env.SECRET_KEY);
        return true;
      } catch (error) {
        return false;
      }
    }

    /**RefreshToken검증 */
    async function validateRefreshToken(refreshtoken) {
      try {
        const decoded = jwt.decode(accesstoken);
        const token = await redisCli.get(`${decoded.userId}`);
        if (refreshtoken === token) {
          jwt.verify(refreshtoken, process.env.SECRET_KEY);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }

    /**검증결과에 따라 true,false가 담김 (type: blooean)*/
    const isAccessTokenValidate = validateAccessToken(accesstoken);
    const isRefreshTokenValidate = await validateRefreshToken(refreshtoken);

    /**토큰이 유효한 경우 */
    if (isAccessTokenValidate) {
      const { userId } = jwt.verify(accesstoken, process.env.SECRET_KEY);
      const user = await User.findOne({ where: { userId: userId } }); //
      res.locals.user = user;
      return next();
    }

    /**refreshtoken 만료시 재로그인 */
    if (!isRefreshTokenValidate) {
      return res.status(403).json({ errMsg: "다시 로그인 해주세요." });
    }

    /**refreshtoken유효 accesstoken 재발급*/
    if (!isAccessTokenValidate && isRefreshTokenValidate) {
      const decoded = jwt.decode(accesstoken);
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, userKey: decoded.userKey },
        process.env.SECRET_KEY,
        {
          expiresIn: "10m",
        }
      );
      res.cookie("accesstoken", newAccessToken, {
        sameSite: "none",
        secure: true,
      });
      const { userId } = jwt.verify(accesstoken, process.env.SECRET_KEY);
      const user = await User.findOne({ where: { userId: userId } }); //
      res.locals.user = user;
      return next();
    }
  } catch (error) {
    next(error);
  }
};
