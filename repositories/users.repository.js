const {
  User,
  isChoice,
  Comment,
  CommentLike,
  Advice,
  Choice,
} = require("../models");

class UserRepository {
  createUser = async ({
    userId: userId,
    nickname: nickname,
    password: hashed,
    isAdult: isAdult,
  }) => {
    console.log("레파지토리", isAdult);
    return await User.create({
      userId: userId,
      nickname: nickname,
      password: hashed,
      isAdult: isAdult,
      userImg:
        "https://imgfiles-cdn.plaync.com/file/LoveBeat/download/20200204052053-LbBHjntyUkg2jL3XC3JN0-v4"
    });
  };

  findUser = async (userKey) => {
    return await User.findOne({
      where: { userKey: userKey },
      include: [{ model: isChoice }, { model: Comment }],
    });
  };

  findUserImage = async (userKey) => {
    return await User.findOne({
      where: { userKey: userKey },
    });
  };  

  findNickname = async (nickname) => {
    return await User.findOne({ where: { nickname: nickname } });
  };

  findUserId = async (userId) => {
    return await User.findOne({ where: { userId: userId } });
  };

  uploadUserImage = async (findUserImage, userKey) => {
    const updateImageUrl = await User.update(
      { userImg: findUserImage},
      { where: { userKey } }
    );
    return updateImageUrl;
  };

  //메세지 오픈 횟수 +1
  messageCountUp = async (userKey) => {
    return await User.increment(
      { msgOpenCount: 1 },
      { where: { userKey: userKey } }
    );
  };

  totalChoice = async (userKey) => {
    return await isChoice.findAll({ where: { userKey: userKey } });
  };

  totalReword = async (userKey) => {
    return await User.findAll({
      where: { userKey: userKey },
      include: [
        { model: Comment, include: { model: CommentLike } },
        { model: isChoice },
        { model: Advice },
        { model: Choice },
      ],
    });
  };

  updateUserNickname = async (userKey, nickname) => {
    const updateAdviceContentData = await User.update(
      { nickname: nickname },
      { where: { userKey: userKey } }
    );
    return updateAdviceContentData;
  };
}

module.exports = UserRepository;
