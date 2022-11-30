const { AdviceImage } = require("../models");

class AdviceImageRepository {
  //조언 게시글 업로드
  createAdviceImage = async (adviceId, imageFilename) => {
    for (let i = 0; i < imageFilename.length; i++) {
      await AdviceImage.create({
        adviceId: adviceId,
        adviceImage: imageFilename[i]
      });
    }
    return;
  };

  // 조언 게시글 이미지 삭제
  imageDelete = async (adviceId) => {
    return await AdviceImage.destroy({ where: { adviceId: adviceId }});
  }

  adviceImageFind = async (adviceId) => {
    const findAdviceImage = await AdviceImage.findAll({
      where: {adviceId: adviceId}
    })
    return findAdviceImage
  }  

}

module.exports = AdviceImageRepository;
