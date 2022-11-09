const { Advice, AdviceBM, User } = require("../models");

class AdviceRepository {
  //조언 게시글 업로드
  createAdvice = async (userKey, title, categoryId, content) => {
    const createAdvice = await Advice.create({
      userKey: userKey,
      title: title,
      categoryId: categoryId,
      content: content,
    });
    return createAdvice;
  };

  adviceHot = async (userKey) => {
    const adviceHot5 = await Advice.findAll({
      order: [["viewCount", "DESC"]],
      limit: 5,
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        { model: AdviceBM, where: { userKey: userKey }, required: false },
      ],
    });
    return adviceHot5;
  };

  findAllAdvice = async (userKey) => {
    const findAllAdvice = await Advice.findAll({
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        { model: AdviceBM, where: { userKey: userKey } },
      ],
    });
    return findAllAdvice;
  };
}

module.exports = AdviceRepository;
