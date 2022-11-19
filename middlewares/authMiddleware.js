const jwt = require("jsonwebtoken");
const { User } = require("../models");
const redisCli = require("../util/redis");
require("dotenv").config();

// 유저 인증에 실패하면 403 상태 코드를 반환한다.
module.exports = async (req, res, next) => {
  try {
    const { authorization, refreshtoken } = req.headers;

    const tokenType = authorization.split(" ")[0];
    const accessToken = authorization.split(" ")[1];
    const refreshToken = refreshtoken;
    if (tokenType !== "Bearer")
      return res
        .status(400)
        .json({ message: "잘못된 요청입니다. 다시 로그인 해주세요" });

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
    const validateRefreshToken = async (refreshToken) => {
      try {
        const decoded = jwt.decode(accessToken);
        const token = await redisCli.get(`${decoded.userId}`);
        console.log(token);
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

    /**refreshToken 만료시 재로그인 */
    if (refreshToken && !isRefreshTokenValidate) {
      return res.status(419).json({ message: "다시 로그인 해주세요" });
    }

    /**refreshToken유효 accesstoken 재발급*/
    if (refreshToken && accessToken && isRefreshTokenValidate) {
      const decoded = jwt.decode(accessToken);
      const newAccessToken = jwt.sign(
        { userId: decoded.userId, userKey: decoded.userKey },
        process.env.SECRET_KEY
        // {
        //   expiresIn: "60s",
        // }
      );
      return res
        .status(200)
        .json({ message: "토큰 재발급 성공", accessToken: newAccessToken });
    }

    /**AccessToken만료시 서버에게 만료상태 전송*/
    if (
      !refreshToken &&
      !isAccessTokenValidate &&
      accessToken !== "undefined"
    ) {
      return res.status(401).json({ message: "토큰 만료됨", ok: false });
    } else if (accessToken !== "undefined") {
      /**토큰이 유효한 경우 */
      const { userId } = jwt.verify(accessToken, process.env.SECRET_KEY);
      console.log("유저아이디");
      console.log(userId);
      const user = await User.findOne({ where: { userId: userId } }); //
      res.locals.user = user;
    } else {
      //토큰이 없는 요청일시 익명유저 정보를 저장
      res.locals.user = { userKey: 0, userId: "Anonymous" };
    }
    next();
  } catch (error) {
    next(error);
  }
};
