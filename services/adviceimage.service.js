const AdviceImageRepository = require("../repositories/adviceimage.repository");
const UserRepository = require("../repositories/users.repository");

class AdviceImageService {
  adviceImageRepository = new AdviceImageRepository();
  userRepository = new UserRepository();

  createAdviceImage = async (adviceId, imageUrl) => {
    console.log(imageUrl, "이건 어딧지?")
    const createAdviceImageData =
      await this.adviceImageRepository.createAdviceImage(adviceId, imageUrl);
      
    return createAdviceImageData;
  };

  uploadImage = async (imageUrl, imageId) => {
    console.log(imageUrl, "이거도 나오나")
    const uploadImagesData = await this.adviceImageRepository.uploadImage(
      imageUrl,
      imageId,
    );
    return uploadImagesData;
  };
  
  imageDelete = async (imageUrl, imageId) => {
    const deleteImage = await this.adviceImageRepository.imageDelete(imageId);
    return deleteImage
  };

}

module.exports = AdviceImageService;
