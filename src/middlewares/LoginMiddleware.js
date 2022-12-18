require("dotenv").config();

/** 로그인 되어 있는 유저일 경우 Error를 반환 */
module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const acesstokenType = authorization?.split(" ")[0];

    const accessToken = authorization?.split(" ")[1];

    if (authorization && acesstokenType !== "Bearer") {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    } else if (authorization && accessToken !== "undefined") {
      return res.status(400).json({ message: "이미 로그인되어 있습니다." });
    }

    next();
  } catch (error) {
    console.trace(error);
    return res.status(400).send({
      errorMessage: "잘못된 접근입니다.",
    });
  }
};
