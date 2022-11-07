const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ErrorCustom = require("../exceptions/error-custom");
const redisCli = require("../util/redis");
require("dotenv").config();

// 유저 인증에 실패하면 403 상태 코드를 반환한다.
module.exports = async (req, res, next) => {
  try {
    console.log("////////////미들웨어///////////////");
    console.log(req.cookies);
    let accesstoken;
    let refreshtoken;

    //개발환경일때 쿠키로 받음
    // if (process.env.NODE_ENV == "development") {
    //   console.log("throw");
    //   const { accesstoken: a_token, refreshtoken: r_token } = req.cookies;
    //   accesstoken = a_token;
    //   refreshtoken = r_token;
    // }

    //배포환경일땐 헤더로 전송받음
    if ("production" == "production") {
      const { authorization, refreshtoken: r_token } = req.headers;
      const tokenType = authorization.split(" ")[0];
      accesstoken = authorization.split(" ")[1];
      refreshtoken = r_token;
      console.log(authorization.split(" "));
      if (tokenType !== "Bearer")
        throw new ErrorCustom(400, "잘못된 요청입니다. 다시 로그인 해주세요");
    }

    if (!accesstoken) {
      return res.status(403).send({
        errorMessage: "로그인이 필요한 기능입니다.",
      });
    }

    /**검증결과에 따라 true,false가 담김 (type: blooean)*/
    const isAccessTokenValidate = validateAccessToken(accesstoken);
    const isRefreshTokenValidate = validateRefreshToken(refreshtoken);

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
    function validateRefreshToken(refreshtoken) {
      try {
        const decoded = jwt.decode(refreshtoken);
        const token = redisCli.get(decoded.userId);
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

    /**refreshToken 만료시 재로그인 */
    if (refreshtoken && !isRefreshTokenValidate) {
      return res.status(419).json({ message: "다시 로그인 해주세요" });
    }

    /**refreshToken유효 accesstoken 재발급*/
    if (refreshtoken && accesstoken && isRefreshTokenValidate) {
      const decoded = jwt.decode(accesstoken);
      const accessToken = jwt.sign(
        { userKey: decoded.userKey },
        process.env.SECRET_KEY,
        {
          expiresIn: "60s",
        }
      );
      res
        .status(200)
        .json({ message: "토큰 재발급 성공", accesstoken: accessToken });
    }

    /**AccessToken만료시 서버에게 만료상태 전송*/
    if (!isAccessTokenValidate) {
      return res.status(401).json({ message: "토큰 만료됨", ok: false });
    } else {
      /**토큰이 유효한 경우 */
      const { userKey } = jwt.verify(accesstoken, process.env.SECRET_KEY);
      const user = await User.findByPk(userKey);
      res.locals.user = user;
    }
    console.log(res.locals.user);
    next();
  } catch (error) {
    next(error);
  }
};
