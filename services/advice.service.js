const { ValidationError } = require("sequelize");
const AdviceRepository = require("../repositories/advice.repository");

class AdviceService {
  adviceRepository = new AdviceRepository();

  createAdvice = async (userKey, title, categoryId, content) => {
    const createAdviceData = await this.adviceRepository.createAdvice(
      userKey,
      title,
      categoryId,
      content
    );
    console.log(createAdviceData.adviceId, "으아아아아아아아");
    return createAdviceData;
  };

  findAllAdvice = async (userKey) => {
    const findAllAdvice = await this.adviceRepository.findAllAdvice(userKey);

    const data = findAllAdvice.map((post) => {
      let boolean;
      post.AdviceBMs.length ? (boolean = true) : (boolean = false);
      return {
        adviceId: post.adviceId,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        userImage: post.User.userImg,
        nickname: post.User.nickname,
        isBookMark: boolean,
        viewCount: post.viewCount,
      };
    });
    return data;
  };
}

module.exports = AdviceService;
