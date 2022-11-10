const { User, Choice, isChoice, ChoiceBM } = require("../models");
const { Op } = require("sequelize");

class ChoiceRepository {
  choice = new Choice();

  createchoice = async (userKey, title, choice1Name, choice2Name, endTime) => {
    const createData = await Choice.create({
      userKey,
      title,
      choice1Name,
      choice2Name,
      endTime,
    });
    return createData;
  };

  findAllchoice = async () => {
    const findAllchoice = await Choice.findAll();
    return findAllchoice ;
  };

  findOneData = async (i) => {
    const findOnechoice = await Choice.findAll();
    return findOnechoice[i] ;
  };

  findUserData = async (userKey) => {
    const data = await User.findByPk(userKey)
    const returnData ={
      userKey: data.userKey,
      userImg: data.userImg,
      nickname: data.nickname
    }
    return returnData
  }

  findMychoice = async (userKey) => {
    const findMychoice = await Choice.findAll({
      where: {userKey: userKey}
    });
    return findMychoice;
  };

  myData = async (userKey) => {
    const data = await User.findByPk(userKey);
    return data;
  }

  deletechoice = async (userKey, choiceId) => {
    return await Choice.destroy({where:{choiceId, userKey}})
  };

  isChoiceForAll = async (userKey, choiceId) => {
    const data = await isChoice.findOne({
      where: { userKey, choiceId }
    })
    return data

  }

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
      where: { userKey, choiceId }
    })
    return data
  }

  //선택을 한 경우, 데이터 생성
  doChoice = async (userKey, choiceId, choiceNum) => {
      try{
      const isChoiceData = await isChoice.create({
        userKey,
        choiceId,
        choiceNum,
      });

      const dataCount = await isChoice.findAll({
        where: {choiceId}
      })
      let data_1 = 0;
      let data_2 = 0;
      for (let i = 0; i < dataCount.length; i++){
        console.log(dataCount[i])
        if(dataCount[i].choiceNum ===1){
          data_1++
        }else{
          data_2++
        }
      }
      let all = data_1 + data_2
      
      await Choice.update({choice1Per: data_1}, { where: {choiceId }})
      await Choice.update({choice2Per: data_2}, { where: {choiceId }})
      await Choice.update({choiceCount: all}, { where: {choiceId }})

      return isChoiceData;
    }catch(err){
      
    }
  };

  //선택을 취소한 경우, 데이터 삭제
  cancelChoice = async (userKey, choiceId) => {
    const isChoiceData = await isChoice.destroy({
      where: {
        [Op.and]: [{ userKey }, { choiceId }],
      },
    });

    const dataCount = await isChoice.findAll({
      where: {choiceId}
    })
    let data_1 = 0;
    let data_2 = 0;
    for (let i = 0; i < dataCount.length; i++){
      console.log(dataCount[i])
      if(dataCount[i].choiceNum ===1){
        data_1++
      }else{
        data_2++
      }
    }
    let all = data_1 + data_2
    await Choice.update({choice1Per: data_1}, { where: {choiceId }})
    await Choice.update({choice2Per: data_2}, { where: {choiceId }})
    await Choice.update({choiceCount: all}, { where: {choiceId }})


    return isChoiceData;
  };

  //투표를 완료한 경우, 해당 choice테이블에서 투표 데이터를 가져온다.
  //choice1Per의 값은 자신의 choiceId를 가진 투표 파일 중 choiceNum이 1인 것의 수
  resultChoice = async (choiceId) => {
    const result = await Choice.findOne({
      where: {
        [Op.and]: [{ choiceId }],
      },
    });

    const choice_1 = result.choice1Per
    const choice_2 = result.choice2Per
    const choiceCount = result.choiceCount
    return {
      choice_1,
      choice_2,
      choiceCount
    };
  };

  choiceHot = async (userKey) => {
    const choiceHot5 = await Choice.findAll({
      order: [["choiceCount", "DESC"]],
      limit: 5,
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        { model: ChoiceBM, where: { userKey: userKey }, required: false },
      ],
    });
    return choiceHot5;
  };
}

module.exports = ChoiceRepository;
