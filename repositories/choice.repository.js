const { User, Choice, isChoice, ChoiceBM } = require("../models");
const { Op } = require("sequelize");

class ChoiceRepository {
  choice = new Choice();

  createchoice = async (userKey, title, choice1Name, choice2Name, date) => {
    const createData = await Choice.create({
      userKey,
      title,
      choice1Name,
      choice2Name,
      endTime: date,
      choice1Per: 0,
      choice2Per: 0,
      isEnd: false,
    });
    return createData;
  };

  updateEnd = async (choiceId) => {
    await Choice.update({ isEnd: true }, { where: { choiceId: choiceId } });
  };

  findAllchoice = async (userKey) => {
    const findAllchoice = await Choice.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: User },
        { model: isChoice, where: { userKey: userKey }, required: false },
        { model: ChoiceBM, where: { userKey: userKey }, required: false },
      ],
    });
    return findAllchoice;
  };

  findUserChoice = async (userKey) => {
    const findOnechoice = await Choice.findAll({ where: { userKey: userKey } });
    return findOnechoice;
  };

  findUserData = async (userKey) => {
    const data = await User.findByPk(userKey);
    const returnData = {
      userKey: data.userKey,
      userImg: data.userImg,
      nickname: data.nickname,
    };
    return returnData;
  };

  findMychoice = async (userKey) => {
    const findMychoice = await Choice.findAll({
      where: { userKey: userKey },
    });
    return findMychoice;
  };

  myData = async (userKey) => {
    const data = await User.findByPk(userKey);
    return data;
  };

  deletechoice = async (choiceId) => {
    return await Choice.destroy({ where: { choiceId: choiceId } });
  };

  isChoiceForAll = async (userKey, choiceId) => {
    const data = await isChoice.findOne({
      where: { userKey, choiceId },
    });
    return data;
  };

  //투표 여부 데이터 가져오기
  isChoice = async (userKey, choiceId) => {
    const isChoiceData = await isChoice.findOne({
      where: {
        [Op.and]: [{ userKey }, { choiceId }],
      },
    });
    return isChoiceData;
  };

  //북마크 여부 가져오기
  isBookMark = async (userKey, choiceId) => {
    const data = await ChoiceBM.findOne({
      where: { userKey, choiceId },
    });
    return data;
  };

  //선택을 한 경우, 데이터 생성
  doChoice = async (userKey, choiceId, choiceNum) => {
    try {
      const isChoiceData = await isChoice.create({
        userKey,
        choiceId,
        choiceNum,
      });

      const dataCount = await isChoice.findAll({
        where: { choiceId },
      });
      let data_1 = 0;
      let data_2 = 0;
      for (let i = 0; i < dataCount.length; i++) {
        console.log(dataCount[i]);
        if (dataCount[i].choiceNum === 1) {
          data_1++;
        } else {
          data_2++;
        }
      }
      let all = data_1 + data_2;

      await Choice.update({ choice1Per: data_1 }, { where: { choiceId } });
      await Choice.update({ choice2Per: data_2 }, { where: { choiceId } });
      await Choice.update({ choiceCount: all }, { where: { choiceId } });

      return isChoiceData;
    } catch (err) {}
  };

  //선택을 취소한 경우, 데이터 삭제
  cancelChoice = async (userKey, choiceId) => {
    const isChoiceData = await isChoice.destroy({
      where: {
        [Op.and]: [{ userKey }, { choiceId }],
      },
    });

    const dataCount = await isChoice.findAll({
      where: { choiceId },
    });
    let data_1 = 0;
    let data_2 = 0;
    for (let i = 0; i < dataCount.length; i++) {
      console.log(dataCount[i]);
      if (dataCount[i].choiceNum === 1) {
        data_1++;
      } else {
        data_2++;
      }
    }
    let all = data_1 + data_2;
    await Choice.update({ choice1Per: data_1 }, { where: { choiceId } });
    await Choice.update({ choice2Per: data_2 }, { where: { choiceId } });
    await Choice.update({ choiceCount: all }, { where: { choiceId } });

    return isChoiceData;
  };

  //투표를 완료한 경우, 해당 choice테이블에서 투표 데이터를 가져온다.
  resultChoice = async (choiceId) => {
    const result = await Choice.findOne({
      where: {
        [Op.and]: [{ choiceId }],
      },
    });

    const choice_1 = result.choice1Per;
    const choice_2 = result.choice2Per;
    const choiceCount = result.choiceCount;
    return {
      choice_1,
      choice_2,
      choiceCount,
    };
  };

  choiceSeach = async (userKey, keyword) => {
    const seachResult = await Choice.findAll({
      where: {
        title: {
          [Op.like]: "%" + keyword + "%",
        },
      },
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        { model: ChoiceBM, where: { userKey: userKey }, required: false },
        { model: isChoice, where: { userKey: userKey }, required: false },
      ],
    });
    return seachResult;
  };

  early = async (choiceId, userKey) => {
    const today = new Date();

    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);

    const dateString = year + "-" + month + "-" + day;

    const hours = ("0" + today.getHours()).slice(-2);
    const minutes = ("0" + today.getMinutes()).slice(-2);
    const seconds = ("0" + today.getSeconds()).slice(-2);

    const timeString = hours + ":" + minutes + ":" + seconds;

    const deadline = dateString + " " + timeString;

    const findMyChoice = await Choice.findOne({
      where: { choiceId: choiceId },
    });

    if (findMyChoice.userKey !== userKey) {
      return true;
    }

    if (today > findMyChoice.endTime) {
      return;
    }

    const early = await Choice.update(
      { endTime: deadline, isEnd: true },
      { where: { choiceId: choiceId } }
    );
    return early;
  };
}

module.exports = ChoiceRepository;
