const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ErrorCustom = require("../exceptions/error-custom");
require("dotenv").config();

// 유저 인증에 실패하면 403 상태 코드를 반환한다.
module.exports = async (req, res, next) => {
  try {
    let accesstoken;
    let refreshtoken;

    //개발환경일때 쿠키로 받음
    if (process.env.NODE_ENV == "development") {
      const { accesstoken = accesstoken, refreshtoken = refreshtoken } =
        req.cookies;
    }

    //배포환경일땐 헤더로 전송받음
    if (process.env.NODE_ENV == "production") {
      const { authorization } = req.headers;
      const tokenType = authorization.split(" ")[0];
      accesstoken = authorization.split(" ")[1];
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
        jwt.verify(refreshtoken, process.env.SECRET_KEY);
        return true;
      } catch (error) {
        return false;
      }
    }

    /**refreshToken만료시 재로그인 요청 */
    if (!isRefreshTokenValidate)
      return res.status(419).json({ message: "다시 로그인 해주세요." });

    /**AccessToken만 만료시 AccessToken재발급 */
    if (!isAccessTokenValidate) {
      /**refresh토큰 에서 유저정보 받아오기 */
      console.log(jwt.verify(refreshtoken, process.env.SECRET_KEY));
      const decoded = jwt.decode(accesstoken);
      console.log("hereeeeeeeeeeee");
      console.log(decoded);

      /**AccessToken 재발급 */
      const newAccessToken = jwt.sign(
        { userId: userId },
        process.env.SECRET_KEY,
        { expiresIn: "10s" }
      );

      /**유저정보 DB에서 찾아오기*/
      const user = await User.findByPk(userId);

      /**새로 발급받은 토큰전송 */
      res.cookie("accessToken", newAccessToken);
      console.log("토큰 재발급");

      /**로그인 유저정보 저장 */
      res.locals.user = user;
    } else {
      /**토큰이 모두 유효한 경우 */
      const { userId } = jwt.verify(accesstoken, process.env.SECRET_KEY);
      const user = await User.findByPk(userId);
      res.locals.user = user;
    }

    res.status(200).json({ msg: "성공" });
    // next();
  } catch (error) {
    next(error);
  }
};
