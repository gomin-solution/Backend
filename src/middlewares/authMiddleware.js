const jwt = require("jsonwebtoken");
const { User } = require("../models");
const redisCli = require("../util/redis");
require("dotenv").config();

// 유저 인증에 실패하면 403 상태 코드를 반환한다.
module.exports = async (req, res, next) => {
  try {
    const { authorization, refreshtoken } = req.headers;
    console.log("////////미들웨어/////////");
    console.log("refreshtoken", refreshtoken);

    const acesstokenType = authorization?.split(" ")[0];
    const refreshTokenType = refreshtoken?.split(" ")[0];
    const accessToken = authorization?.split(" ")[1];
    const refreshToken = refreshtoken?.split(" ")[1];

    if (accessToken == "undefined") {
      //익명유저
      res.locals.user = { userKey: 0, userId: "Anonymous" };
      return next();
    }

    if (
      (authorization && acesstokenType !== "Bearer") ||
      (refreshtoken && refreshTokenType !== "Bearer")
    )
      return res
        .status(400)
        .json({ message: "잘못된 요청입니다. 다시 로그인 해주세요" });

    /**AccessToken검증 */
    function validateAccessToken(accessToken) {
      try {
        jwt.verify(accessToken, process.env.SECRET_KEY);
        return true;
      } catch (error) {
        return false;
      }
    }

    /**RefreshToken검증 */
    async function validateRefreshToken(refreshToken) {
      try {
        const decoded = jwt.decode(accessToken);
        const token = await redisCli.get(`${decoded.userId}`);
        console.log("decoded.userId", decoded.userId);
        console.log("refreshToken", refreshToken);
        console.log("token", token);
        if (refreshToken === token) {
          jwt.verify(refreshToken, process.env.SECRET_KEY);
          return true;
        } else {
          console.log("/////////토큰 불일치///////");
          return false;
        }
      } catch (error) {
        console.log("////////토큰 만료/////////");
        return false;
      }
    }

    const isAccessTokenValidate = validateAccessToken(accessToken);
    const isRefreshTokenValidate = await validateRefreshToken(refreshToken);

    if (!isRefreshTokenValidate) {
      return res.status(403).json({ message: "다시 로그인 해주세요." });
    }

    if (!isAccessTokenValidate && isRefreshTokenValidate) {
      const decoded = jwt.decode(accessToken);
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, userKey: decoded.userKey },
        process.env.SECRET_KEY,
        {
          expiresIn: "30s",
        }
      );
      return res
        .status(201)
        .json({ message: "토큰 재발급", accessToken: newAccessToken });
    }

    if (!isAccessTokenValidate) {
      return res.status(405).json({ message: "만료" });
    } else if (accessToken !== "undefined" && isAccessTokenValidate) {
      /**토큰이 유효한 경우 */
      const { userId } = jwt.decode(accessToken);
      const user = await User.findOne({ where: { userId: userId } });
      res.locals.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};
