const ErrorCustom = require("../exceptions/error-custom");
const UserRepository = require("../repositories/users.repository.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserService {
  userRepository = new UserRepository();

  createUser = async ({
    username: username,
    nickname: nickname,
    password: hashed,
  }) => {
    await this.userRepository.createUser({
      username: username,
      nickname: nickname,
      password: hashed,
    });
  };

  verifyUser = async (username, password) => {
    console.log("service", username);
    const user = await this.userRepository.findUser(username);
    if (!user) throw new ErrorCustom(400, "가입되지 않은 아이디 입니다");

    const passwordVerify = await bcrypt.compare(password, user.password);

    if (!passwordVerify) throw new ErrorCustom(400, "비밀번호 오류");

    const accessToken = jwt.sign(
      { userId: user.userId },
      process.env.SECRET_KEY,
      {
        expiresIn: "60s",
      }
    );

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return { accessToken, refreshToken };
  };
}

module.exports = UserService;
