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

      // const data = await redisCli.set(userId, refreshToken);
      // console.log(data);

      res.cookie("accesstoken", accessToken);
      res.cookie("refreshtoken", refreshToken);

      return res
        .status(200)
        .json({ accessToken, refreshToken, message: "로그인 성공." });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
