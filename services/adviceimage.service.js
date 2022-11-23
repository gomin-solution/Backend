const AdviceImageRepository = require("../repositories/adviceimage.repository");
const UserRepository = require("../repositories/users.repository");

class AdviceImageService {
  adviceImageRepository = new AdviceImageRepository();
  userRepository = new UserRepository();

  // 조언 게시물 이미지 생성
  createAdviceImage = async (adviceId, imageUrl, resizeUrl) => {
    const createAdviceImageData =
      await this.adviceImageRepository.createAdviceImage(adviceId, imageUrl, resizeUrl);
    return createAdviceImageData;
  };

  // updateAdviceImage = async (imageUrl, imageId) => {
  //   const uploadImagesData = await this.adviceImageRepository.updateAdviceImage(
  //     imageUrl,
  //     imageId,
  //   );
  //   return uploadImagesData;
  // };
  
  // 조언 게시글 이미지 삭제(이미지 아이디 기준)
  imageDelete = async (adviceId) => {
    const deleteImage = await this.adviceImageRepository.imageDelete(adviceId);
    return deleteImage
  };

  // 조언 게시글 1개 이미지 전체 받아오기!(게시글 삭제용)
  adviceImageFind = async (adviceId) => {
    const adviceFindAllImage = await this.adviceImageRepository.adviceImageFind(adviceId);
    return adviceFindAllImage
  }

}

module.exports = AdviceImageService;
