const AdviceImageRepository = require("../repositories/adviceimage.repository");
const UserRepository = require("../repositories/users.repository");

class AdviceImageService {
  adviceImageRepository = new AdviceImageRepository();
  userRepository = new UserRepository();

  // 조언 게시물 이미지 생성
  createAdviceImage = async (adviceId, imageUrl) => {
    const imageFilename = [];
    for (let i=0; i<imageUrl.length; i++) {
      imageFilename.push(imageUrl[i].split('/')[4])
    }
    const createAdviceImageData =
      await this.adviceImageRepository.createAdviceImage(adviceId, imageFilename);
    return createAdviceImageData;
  };
  
  // 조언 게시글 이미지 삭제(이미지 아이디 기준)
  imageDelete = async (adviceId) => {
    const deleteImage = await this.adviceImageRepository.imageDelete(adviceId);
    return deleteImage
  };

  // 조언 게시글 1개 이미지 전체 받아오기!(게시글 삭제용)
  adviceImageFind = async (adviceId) => {
    const adviceFindAllImage = await this.adviceImageRepository.adviceImageFind(adviceId);
    const adviceFindOriginalImage = adviceFindAllImage.map((image) => "adviceimage/"+image.adviceImage)
    const adviceFindResizelImage = adviceFindAllImage.map((image) => "adviceimage-resize/"+image.adviceImage)
    const adviceFindImageUrl = adviceFindOriginalImage.concat(adviceFindResizelImage)
    return adviceFindImageUrl;
  }

}

module.exports = AdviceImageService;
