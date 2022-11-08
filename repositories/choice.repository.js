//const { User, choice } = require('../db/models');          //모델 데이터를 가져와야함

class ChoiceRepository {
  createchoice = async (title, choice1Name, choice2Name, endTime) => {
    const createData = await choice.create({
      title,
      choice1Name,
      choice2Name,
      endTime,
    });
    return createData;
  };

  findAllchoice = async () => {
    const findAllchoice = await choice.findAll();
    return findAllchoice;
  };

  findMychoice = async (userId) => {
    const findMychoice = await choice.findByPk(userId);
    return findMychoice;
  };

  deletechoice = async (userId, choiceId) => {
    const temp = await choice.findByPk(choiceId);
    const temp_Id = temp.userId;
    if (uesrId !== temp_Id) {
      return;
    }
    const deletechoice = await choice.destroy({ where: { choiceId } });
    return deletechoice;
  };

  choice_1 = async (userId, choiceId, choiceData) => {
    const choice = await choice.findByPk(choiceId);
  };

  choice_2 = async (userId, choiceId, choiceData) => {};

  choiceHot = async () => {
    const choiceHot5 = await choice.findAll({
      attributes: ["choiceCount"],
      order: [["choiceCount", "DESC"]],
      limit: 5,
    });
    return choiceHot5;
  };
}

module.exports = ChoiceRepository;
