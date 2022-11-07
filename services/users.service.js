const ErrorCustom = require("../exceptions/error-custom");
const UserRepository = require("../repositories/users.repository.js");
const AdviceRepository = require("../repositories/advice.rpository");
// const ChoiceRepository = require("../repositories/choice.repository");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

class UserService {
  userRepository = new UserRepository();
  adviceRepository = new AdviceRepository();
  // choiceRepository = new ChoiceRepository();

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
      {
        expiresIn: "60s",
      }
    );

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    return { accessToken, refreshToken };
  };

  findNickname = async (nickname) => {
    const findNickname = await this.userRepository.findNickname(nickname);
    if (nickname !== findNickname)
      throw new ErrorCustom(400, "이미 존재하는 닉네임 입니다.");

    return;
  };

  findUserId = async (userId) => {
    const findUserId = await this.userRepository.findUserId(userId);
    if (userId !== findUserId)
      throw new ErrorCustom(400, "이미 존재하는 아이디 입니다.");

    return;
  };

  mainPage = async () => {
    const getChoice = await this.choiceRepository;

    const getAdvice = await this.adviceRepository;

    return { choice: getChoice, advice: getAdvice };
  };
}

module.exports = UserService;
