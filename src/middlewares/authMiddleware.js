const jwt = require("jsonwebtoken");
const { User } = require("../models");
const redisCli = require("../util/redis");
require("dotenv").config();

/**유저 인증 미들웨어 */
module.exports = async (req, res, next) => {
  try {
    const { authorization, refreshtoken } = req.headers;

    /**헤더에 설정이 없는경우 에러응답 */
    if (!authorization || !refreshtoken) {
      return res.status(400).json({ message: "잘못된 요청입니다." });
    }

    const acesstokenType = authorization?.split(" ")[0];
    const refreshTokenType = refreshtoken?.split(" ")[0];

    const accessToken = authorization?.split(" ")[1];
    const refreshToken = refreshtoken?.split(" ")[1];

    /**토큰타입 검증 */
    if (acesstokenType !== "Bearer" || refreshTokenType !== "Bearer")
      return res
        .status(400)
        .json({ message: "잘못된 요청입니다. 다시 로그인 해주세요" });

    /**익명유저 다음미들웨어 호출 */
    if (accessToken == "undefined") {
      res.locals.user = { userKey: 0, userId: "Anonymous" };
      return next();
    }

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
        if (refreshToken === token) {
          jwt.verify(refreshToken, process.env.SECRET_KEY);
          return true;
        } else {
          return false;
        }
      } catch (error) {
        return false;
      }
    }

    /**AccessToken검증 결과 */
    const isAccessTokenValidate = validateAccessToken(accessToken);

    /**RefreshToken검증 결과 */
    const isRefreshTokenValidate = await validateRefreshToken(refreshToken);

    if (!isRefreshTokenValidate) {
      return res.status(403).json({ message: "다시 로그인 해주세요." });
    }

    if (!isAccessTokenValidate) {
      const decoded = jwt.decode(accessToken);

      /**재발급 토큰 */
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, userKey: decoded.userKey },
        process.env.SECRET_KEY,
        {
          expiresIn: "30m",
        }
      );

      return res
        .status(201)
        .json({ message: "토큰 재발급", accessToken: newAccessToken });
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
