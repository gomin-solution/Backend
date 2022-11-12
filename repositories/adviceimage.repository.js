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

  // updateAdviceImage = async (imageUrl, imageId) => {
  //   const imageIds = imageId.split(",");

  //   for (let i = 0; i < imageIds.length; i++) {
  //     await AdviceImage.update(
  //       { adviceImage: imageUrl[i] },
  //       { where: { adviceImageId: imageIds[i] } }
  //     );
  //   }
  //   return;
  // };

  // 조언 게시글 이미지 삭제(수정용)
  imageDelete = async (imageId) => {
    const imageIds = imageId.split(",");
    for (let i = 0; i < imageIds.length; i++) {
      await AdviceImage.destroy({
        where: { adviceImageId: imageIds[i] },
      });
    }
    return;
  };

  adviceImageFind = async (adviceId) => {
    const findAdviceImage = await AdviceImage.findAll({
      where: {adviceId: adviceId}
    })
    const adviceFindAllImage = [];
    for (let i=0; i<findAdviceImage.length; i++){
      adviceFindAllImage.push(findAdviceImage[i].adviceImage)
    }
    return adviceFindAllImage;
  }  

}

module.exports = AdviceImageRepository;
