const { ChoiceBM, AdviceBM } = require("../models");

class BookMarkRepository {
  addChoiceBm = async (userKey, choiceId) => {
    await ChoiceBM.findOrCreate({
      where: { userKey: userKey, choiceId: choiceId },
    });
  };

  addAdviceBm = async (userKey, adviceId) => {
    await AdviceBM.findOrCreate({
      where: { userKey: userKey, adviceId: adviceId },
    });
  };
}

module.exports = BookMarkRepository;
