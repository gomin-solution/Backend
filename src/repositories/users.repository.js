const { User, isChoice, Comment, UserActivity } = require("../models");

class UserRepository {
  createUser = async ({
    userId: userId,
    nickname: nickname,
    password: hashed,
    isAdult: isAdult,
  }) => {
    const Userdata = await User.create({
      userId: userId,
      nickname: nickname,
      password: hashed,
      isAdult: isAdult,
      userImg:
        "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage/grade1.png",
    });
    console.log("레파지토리", isAdult);

    await UserActivity.create({ userKey: Userdata.userKey });

    return Userdata;
  };

  userKakao = async (id) => {
    const [data, created] = await User.findOrCreate({
      where: { userId: id },
      defaults: {
        userId: id,
        userImg:
          "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage/grade1.png",
      },
    });
    await UserActivity.create({ userKey: data.userKey });

    return { data, created };
  };

  findUser = async (userKey) => {
    return await User.findOne({
      where: { userKey: userKey },
      include: [{ model: isChoice }, { model: Comment }],
    });
  };

  findUserKey = async (userKey) => {
    return await User.findByPk(userKey);
  };

  findNickname = async (nickname) => {
    return await User.findOne({ where: { nickname: nickname } });
  };

  findUserId = async (userId) => {
    return await User.findOne({ where: { userId: userId } });
  };

  passwordChange = async (userKey, hashed) => {
    return await User.update({ password: hashed }, { where: { userKey } });
  };

  nicknameChange = async (userKey, nickname) => {
    return await User.update({ nickname: nickname }, { where: { userKey } });
  };

  uploadUserImage = async (findUserImage, userKey) => {
    const updateImageUrl = await User.update(
      { userImg: findUserImage },
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
    const totalreward = await UserActivity.findByPk(userKey);

    return totalreward;
  };

  updateUserNickname = async (userKey, nickname) => {
    const updateAdviceContentData = await User.update(
      { nickname: nickname },
      { where: { userKey: userKey } }
    );
    return updateAdviceContentData;
  };

  //회원탈퇴
  bye = async (userKey) => {
    const exit = "탈퇴한 회원입니다.";
    return await User.update(
      { nickname: exit, userId: exit },
      { where: { userKey: userKey } }
    );
  };
}

module.exports = UserRepository;
