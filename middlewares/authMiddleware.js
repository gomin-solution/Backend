const jwt = require("jsonwebtoken");
const { User } = require("../models");
const redisCli = require("../util/redis");
require("dotenv").config();

// 유저 인증에 실패하면 403 상태 코드를 반환한다.
module.exports = async (req, res, next) => {
  try {
    const { authorization, refreshtoken } = req.headers;

    console.log("/////미들웨어 호출/////////");
    console.log("authorization", authorization);
    console.log("refreshtoken", refreshtoken);
    const refreshToken = refreshtoken;
    let accessToken;
    //로그인 안한경우 익명 정보로 저장
    if (authorization == "Bearer undefined") {
      res.locals.user = { userKey: 0, userId: "Anonymous" };
      return next();
    }

    if (authorization) {
      const tokenType = authorization.split(" ")[0];
      accessToken = authorization.split(" ")[1];
      if (tokenType !== "Bearer")
        return res
          .status(400)
          .json({ message: "잘못된 요청입니다. 다시 로그인 해주세요" });
    }

    // if (!accessToken || accessToken == "undefined") {
    //   return res.status(403).send({
    //     errorMessage: "로그인이 필요한 기능입니다.",
    //   });
    // }

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

    /**검증결과에 따라 true,false가 담김 (type: blooean)*/
    const isAccessTokenValidate = validateAccessToken(accessToken);
    const isRefreshTokenValidate = await validateRefreshToken(refreshToken);

    console.log("//////here///////");
    console.log(isAccessTokenValidate);
    console.log(isRefreshTokenValidate);
    console.log(authorization);
    console.log(refreshtoken);

    /**refreshToken 만료시 재로그인 */
    if (refreshToken && !isRefreshTokenValidate) {
      return res.status(403).json({ errMsg: "다시 로그인 해주세요." });
    }

    /**refreshToken유효 accesstoken 재발급*/
    if (refreshToken && isRefreshTokenValidate) {
      const decoded = jwt.decode(accessToken);
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, userKey: decoded.userKey },
        process.env.SECRET_KEY,
        {
          expiresIn: "60s",
        }
      );
      console.log("accessToken재발급");
      return res
        .status(201)
        .json({ msg: "재발급", accessToken: newAccessToken });
    }

    /**AccessToken만료시 서버에게 만료상태 전송*/
    if (!refreshToken && !isAccessTokenValidate) {
      return res.status(405).json({ msg: "만료", ok: false });
    } else if (isAccessTokenValidate) {
      /**토큰이 유효한 경우 */
      const { userId } = jwt.verify(accessToken, process.env.SECRET_KEY);
      const user = await User.findOne({ where: { userId: userId } }); //
      res.locals.user = user;
      return next();
    }
  } catch (error) {
    next(error);
  }
};
