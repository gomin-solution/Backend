const { Advice } = require('../models');

class AdviceRepository {
    //조언 게시글 업로드
    createAdvice = async (userId, title, categoryId, content, uploadImage1, uploadImage2) => {
        const createAdvice = await Advice.create({
            userId: userId,
            title: title,
            categoryId: categoryId,
            content: content,
            adviceImg1: uploadImage1,
            adviceImg2: uploadImage2,
          });
      
          return createAdvice;
    }

}

module.exports = AdviceRepository;