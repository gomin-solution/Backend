const {Advice} = require('../models');

class AdviceRepository {
    //조언 게시글 업로드
    createAdvice = async (userKey, title, categoryId, content) => {
        const createAdvice = await Advice.create({
            userKey: userKey,
            title: title,
            categoryId: categoryId,
            content: content,
          });
      
          return createAdvice;
    }

}

module.exports = AdviceRepository;