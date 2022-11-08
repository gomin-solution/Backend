const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ErrorCustom = require("../exceptions/error-custom");
const redisCli = require("../util/redis");
require("dotenv").config();

// 유저 인증에 실패하면 403 상태 코드를 반환한다.
module.exports = async (req, res, next) => {
  try {
    console.log(req.cookies);
    let accessToken;
    let refreshToken;

    // //개발환경일때 쿠키로 받음
    // if (process.env.NODE_ENV == "development") {
    //   console.log("throw");
    //   const { accesstoken: a_token, refreshtoken: r_token } = req.cookies;
    //   accesstoken = a_token;
    //   refreshtoken = r_token;
    // }

    //배포환경일땐 헤더로 전송받음
    if ("production" == "production") {
      const { authorization, refreshtoken } = req.headers;
      const tokenType = authorization.split(" ")[0];
      accessToken = authorization.split(" ")[1];
      refreshToken = refreshtoken;
      console.log(authorization.split(" "));
      if (tokenType !== "Bearer")
        throw new ErrorCustom(400, "잘못된 요청입니다. 다시 로그인 해주세요");
    }

    if (!accessToken) {
      return res.status(403).send({
        errorMessage: "로그인이 필요한 기능입니다.",
      });
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
    const validateRefreshToken = async (refreshToken) => {
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
    };

    /**검증결과에 따라 true,false가 담김 (type: blooean)*/
    const isAccessTokenValidate = validateAccessToken(accessToken);
    const isRefreshTokenValidate = await validateRefreshToken(refreshToken);

    console.log("여기;");
    console.log();
    console.log(isRefreshTokenValidate);

    /**refreshToken 만료시 재로그인 */
    if (refreshToken && !isRefreshTokenValidate) {
      return res.status(419).json({ message: "다시 로그인 해주세요" });
    }

    /**refreshToken유효 accesstoken 재발급*/
    if (refreshToken && accessToken && isRefreshTokenValidate) {
      const decoded = jwt.decode(accessToken);
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.SECRET_KEY,
        {
          expiresIn: "60s",
        }
      );
      return res
        .status(200)
        .json({ message: "토큰 재발급 성공", accessToken: accessToken });
    }

    /**AccessToken만료시 서버에게 만료상태 전송*/
    if (!isAccessTokenValidate) {
      return res.status(401).json({ message: "토큰 만료됨", ok: false });
    } else {
      /**토큰이 유효한 경우 */
      const { userId } = jwt.verify(accessToken, process.env.SECRET_KEY);
      console.log("유저아이디");
      console.log(userId);
      const user = await User.findOne({ where: { userId: userId } });
      console.log("유저정보");
      console.log(user);
      res.locals.user = user;
    }
    next();
  } catch (error) {
    next(error);
  }
};
