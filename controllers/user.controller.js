const UserService = require("../services/users.service");
const joi = require("../util/joi");
const bcrypt = require("bcrypt");
const ErrorCustom = require("../exceptions/error-custom");
require("dotenv").config();
const redisCli = require("../util/redis");

class UserController {
  userService = new UserService();

  /**회원가입 컨트롤러 */
  signup = async (req, res, next) => {
    try {
      const { userId, nickname, password } =
        await joi.signupSchema.validateAsync(req.body);

      const hashed = await bcrypt.hash(password, 12);

      await this.userService.createUser({
        userId: userId,
        nickname: nickname,
        password: hashed,
      });
      res.status(200).json({ message: "회원가입 성공" });
    } catch (error) {
      next(error);
    }
  };

  /**로그인 컨트롤러 */
  login = async (req, res, next) => {
    try {
      // const { email, password } = await joi.loginSchema.validateAsync(req.body);
      const { userId, password } = req.body;
      console.log(userId, password);

      const { accessToken, refreshToken } = await this.userService.verifyUser(
        userId,
        password
      );

      //refreshtoken을 userId키로 redis에 저장
      await redisCli.set(userId, refreshToken);

      res.cookie("accesstoken", accessToken);
      res.cookie("refreshtoken", refreshToken);

      return res
        .status(200)
        .json({ accessToken, refreshToken, message: "로그인 성공." });
    } catch (error) {
      next(error);
    }
  };

  check = async (req, res, next) => {
    try {
      const { nickname, userId } = req.body;

      if (!nickname && !userId) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
      }

      //닉네임 중복 검사
      if (nickname) {
        await this.userService.findNickname(nickname);
        return res.status(200).json({ message: "사용 가능한 닉네임 입니다" });
      }

      //아이디 중복 검사
      if (userId) {
        await this.userService.findUserId(userId);
        return res.status(200).json({ message: "사용 가능한 아이디 입니다" });
      }
    } catch (error) {
      next(error);
    }
  };

  mainPage = async (req, res, next) => {
    try {
      await this.userService.mainPage();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
