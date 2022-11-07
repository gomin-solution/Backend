const { User } = require("../models");

class UserRepository {
  createUser = async ({
    username: username,
    nickname: nickname,
    password: hashed,
  }) => {
    await User.create({
      username: username,
      nickname: nickname,
      password: hashed,
    });
  };

  findUser = async (username) => {
    console.log("repository", username);
    return await User.findOne({ where: { username: username } });
  };
}

module.exports = UserRepository;
