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
      attributes: ["viewCount"],
      order: [["viewCount", "DESC"]],
      limit: 5,
      include: [
        { model: User },
        { model: AdviceBM, where: { userKey: userKey }, required: false },
      ],
    });
    return adviceHot5;
  };

  findAdvice = async ({ adviceId }) => {
    const findAdvice = await Advice.findOne({ where: { adviceId } });
    return findAdvice;
  };

  updateAdvice = async (adviceId, title, content) => {
    const updateAdvice = await Advice.update(
      { title: title, content: content },
      { where: { adviceId: adviceId } }
    );
    return updateAdvice;
  };
}

module.exports = AdviceRepository;
