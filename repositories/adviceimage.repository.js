const { AdviceImage } = require("../models");

class AdviceImageRepository {
  //조언 게시글 업로드
  createAdviceImage = async (adviceId, imageUrl) => {
    for (let i = 0; i < imageUrl.length; i++) {
      await AdviceImage.create({
        adviceId: adviceId,
        adviceImage: imageUrl[i],
      });
    }
    return;
  };
}

module.exports = AdviceImageRepository;
