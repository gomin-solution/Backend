const { User } = require("../models");

class UserRepository {
  createUser = async ({
    userId: userId,
    nickname: nickname,
    password: hashed,
    isAdult: isAdult,
  }) => {
    await User.create({
      userId: userId,
      nickname: nickname,
      password: hashed,
      isAdult: isAdult,
    });
  };

  findUser = async (userId) => {
    console.log("repository", userId);
    return await User.findOne({ where: { userId: userId } });
  };

  findNickname = async (nickname) => {
    return await User.findOne({ where: { nickname: nickname } });
  };

  findUserId = async (userId) => {
    return await User.findOne({ where: { userId: userId } });
  };
}

module.exports = UserRepository;
