const { Advice } = require("../models");

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
    const adviceHot5 = await choice.findAll({
      attributes: ["viewCount"],
      order: [["viewCount", "DESC"]],
      limit: 5,
    });
    return adviceHot5;
  };
}

module.exports = AdviceRepository;
