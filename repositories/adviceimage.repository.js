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

  uploadImage = async (imageUrl, imageId) => {
    //console.log(imageUrl, imageId.split(','), "어떻게 나오고있나")
    const imageIds = imageId.split(",");

    for (let i = 0; i < imageIds.length; i++) {
      await AdviceImage.update(
        { adviceImage: imageUrl[i] },
        { where: { adviceImageId: imageIds[i] } }
      );
    }
    return;
  };

  imageDelete = async (imageId) => {
    const imageIds = imageId.split(",");
    for (let i = 0; i < imageIds.length; i++) {
      await AdviceImage.destroy({
        where: { adviceImageId: imageIds[i] },
      });
    }
    return;
  };
}

module.exports = AdviceImageRepository;
