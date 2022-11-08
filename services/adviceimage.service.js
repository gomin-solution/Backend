const AdviceImageRepository = require("../repositories/adviceimage.repository");

class AdviceImageService {
  adviceImageRepository = new AdviceImageRepository();

  createAdviceImage = async (adviceId, imageUrl) => {
    const createAdviceImageData =
      await this.adviceImageRepository.createAdviceImage(adviceId, imageUrl);
    return createAdviceImageData;
  };
}

module.exports = AdviceImageService;
