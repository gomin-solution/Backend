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

  updateAdvice = async ({ adviceId, title, content }) => {
    const updateAdvice = await this.adviceRepository.updateAdvice({
      adviceId,
      title,
      content,
    });
    return updateAdvice;
    // const findAdvice = await this.adviceRepository.findAdvice({adviceId});
    // console.log(findAdvice);
    // if (!findAdvice) {
    //     throw new ValidationError("잘못 들어왔어요~!");
    // }
    // if (findAdvice.adviceId === adviceId) {
    //     return await this.adviceRepository.updateAdvice({
    //         adviceId,
    //         title,
    //         content,
    //     });
    // }
  };
}

module.exports = AdviceService;
