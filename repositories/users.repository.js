const { User } = require("../models");

class UserRepository {
  createUser = async ({
    userId: userId,
    nickname: nickname,
    password: hashed,
  }) => {
    await User.create({
      userId: userId,
      nickname: nickname,
      password: hashed,
    });
  };

  findUser = async (userId) => {
    console.log("repository", userId);
    return await User.findOne({ where: { userId: userId } });
  };
}

module.exports = UserRepository;
