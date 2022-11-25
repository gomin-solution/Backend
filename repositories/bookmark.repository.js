const {
  ChoiceBM,
  AdviceBM,
  Choice,
  Advice,
  User,
  Comment,
  isChoice,
  Category,
} = require("../models");

class BookMarkRepository {
  //투표게시글 북마크 없을시 생성 있을시 false반환
  addChoiceBm = async (userKey, choiceId) => {
    const [data, created] = await ChoiceBM.findOrCreate({
      where: { userKey: userKey, choiceId: choiceId },
      defaults: {
        userKey: userKey,
        choiceId: choiceId,
      },
    });

    return created;
  };

  //조언게시글 북마크 없을시 생성 있을시 false반환
  addAdviceBm = async (userKey, adviceId) => {
    const [data, created] = await AdviceBM.findOrCreate({
      where: { userKey: userKey, adviceId: adviceId },
      defaults: {
        userKey: userKey,
        adviceId: adviceId,
      },
    });

    return created;
  };

  //투표게시글 북마크 삭제
  cancelChoiceBm = async (userKey, choiceId) => {
    await ChoiceBM.destroy({ where: { userKey: userKey, choiceId: choiceId } });
  };

  //조언게시글 북마크 삭제
  cancelAdviceBm = async (userKey, adviceId) => {
    await AdviceBM.destroy({ where: { userKey: userKey, adviceId: adviceId } });
  };

  findBmChoice = async (userKey) => {
    const findBmChoice = await ChoiceBM.findAll({
      where: { userKey: userKey },
      include: {
        model: Choice,
        include: [
          { model: User, attributes: ["nickname", "userImg"] },
          { model: isChoice, where: { userKey: userKey }, required: false },
        ],
      },
    });

    return findBmChoice;
  };

  findBmAdvice = async (userKey) => {
    const findBmAdvice = await AdviceBM.findAll({
      where: { userKey: userKey },
      include: {
        model: Advice,
        include: [{ model: Comment }, { model: Category }],
      },
    });

    return findBmAdvice;
  };
}

module.exports = BookMarkRepository;
