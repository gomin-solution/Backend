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
    console.log(createAdviceData.categoryId, "나오나아아아")
    return createAdviceData;
  };

  findAllAdvice = async () => {
    const findAllAdvice = await this.adviceRepository.findAllAdvice();
    console.log(findAllAdvice)
    return findAllAdvice;
  }

  findCategoryAdvice = async (categoryId) => {
    const findCategiryAdvice = await this.adviceRepository.findCategoryAdvice(categoryId);
    return findCategiryAdvice;
}

}

module.exports = AdviceService;
