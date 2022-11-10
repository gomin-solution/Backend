const { User, isChoice } = require("../models");

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
      userImg:
        "https://imgfiles-cdn.plaync.com/file/LoveBeat/download/20200204052053-LbBHjntyUkg2jL3XC3JN0-v4",
    });
  };

  findUser = async (userKey) => {
    return await User.findOne({
      where: { userKey: userKey },
      include: { model: isChoice },
    });
  };

  findNickname = async (nickname) => {
    return await User.findOne({ where: { nickname: nickname } });
  };

  findUserId = async (userId) => {
    return await User.findOne({ where: { userId: userId } });
  };


  uploadUserImage = async (uploadedImage, userKey) => {
    const updateImageUrl = await User.update(
      { userImg: uploadedImage },
      { where: { userKey } }
    );
    return updateImageUrl;
  };
  
  totalChoice = async (userKey) => {
    return await isChoice.findAll({ where: { userKey: userKey } });
  };



}

module.exports = UserRepository;
