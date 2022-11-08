const { Advice, Choice } = require("../models");

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

  adviceHot = async () => {
    const adviceHot5 = await Choice.findAll({
      attributes: ["viewCount"],
      order: [["viewCount", "DESC"]],
      limit: 5,
    });
    return adviceHot5;
  };

  findAllAdvice = async () => {
    const findAllAdvice = await Advice.findAll()
    return findAllAdvice;
  }

}

module.exports = AdviceRepository;
