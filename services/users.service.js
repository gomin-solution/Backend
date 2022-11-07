const ErrorCustom = require("../exceptions/error-custom");
const UserRepository = require("../repositories/users.repository.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserService {
  userRepository = new UserRepository();

  createUser = async ({
    userId: userId,
    nickname: nickname,
    password: hashed,
  }) => {
    await this.userRepository.createUser({
      userId: userId,
      nickname: nickname,
      password: hashed,
    });
  };

  verifyUser = async (userId, password) => {
    const user = await this.userRepository.findUser(userId);
    if (!user) throw new ErrorCustom(400, "가입되지 않은 아이디 입니다");

    const passwordVerify = await bcrypt.compare(password, user.password);

    if (!passwordVerify) throw new ErrorCustom(400, "비밀번호 오류");

    const accessToken = jwt.sign(
      { userKey: user.userKey },
      process.env.SECRET_KEY,
      // {
      //   expiresIn: "60s",
      // }
    );

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return { accessToken, refreshToken };
  };
}

module.exports = UserService;
