const { AdviceImage } = require('../models');

class AdviceImageRepository {
    //조언 게시글 업로드
    createAdviceImage = async (userKey, adviceId, uploadImage) => {
        const createAdvice = await AdviceImage.create({
            userKey: userKey,
            adviceId: adviceId,
            adviceImg: uploadImage,
          });
      
          return createAdvice;
    }

}

module.exports = AdviceImageRepository;