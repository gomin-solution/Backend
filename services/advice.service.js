const { ValidationError } = require("sequelize");
const AdviceRepository = require("../repositories/advice.repository");

class AdviceService {
  adviceRepository = new AdviceRepository();

  createAdvice = async (userKey, title, categoryId, content) => {
    const createAdviceData = await this.adviceRepository.createAdvice(
      userKey,
      title,
      categoryId,
      content
    );
    //console.log(createAdviceData.adviceId, "으아아아아아아아");
    //console.log(createAdviceData.categoryId, "나오나아아아");
    return createAdviceData;
  };

  findAllAdvice = async () => {
    const findAllAdvice = await this.adviceRepository.findAllAdvice();
    //let boolean;
    return findAllAdvice.map((post) => {
      //post.AdviceBMs.length ? (boolean = true) : (boolean = false);
      return {
        adviceId: post.adviceId,
        categoryId: post.categoryId,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        userImage: post.User.userImg,
        nickname: post.User.nickname,
        //isBookMark: boolean,
        viewCount: post.viewCount,
      };
    });
  };

  findCategoryAdvice = async (categoryId) => {
    const findCategoryAdvice = await this.adviceRepository.findCategoryAdvice(
      categoryId
    );
    const data = findCategoryAdvice.map((post) => {
      //let boolean;
      //post.AdviceBMs.length ? (boolean = true) : (boolean = false);
      return {
        adviceId: post.adviceId,
        categoryId: post.categoryId,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        userImage: post.User.userImg,
        nickname: post.User.nickname,
        //isBookMark: boolean,
        viewCount: post.viewCount,
      };
    });
    return data;
  };

  findOneAdvice = async (userKey, adviceId) => {
    const findOneAdvice = await this.adviceRepository.findOneAdvice(userKey, adviceId);
    const findAdviceImageArray = findOneAdvice.AdviceImages.map((post) => post.adviceImage);
    //const test = findAdviceImageArray
    //console.log(findAdviceImageArray, "배열이 아닌가?")
    //console.log(findOneAdvice.AdviceImages[0].adviceImage, "어떻게 들어있나?")
    //console.log(test, "어떻게 나오나 보자")
    //return findOneAdvice
      let boolean;
      findOneAdvice.AdviceBMs.length ? (boolean = true) : (boolean = false);
      
      return {        
        adviceId: findOneAdvice.adviceId,
        categoryId: findOneAdvice.categoryId,
        userKey: findOneAdvice.User.userKey,
        title : findOneAdvice.title,
        content : findOneAdvice.content,
        createdAt: findOneAdvice.createdAt,
        updatedAt : findOneAdvice.updatedAt,
        userImage : findOneAdvice.User.userImg,
        nickname : findOneAdvice.User.nickname,
        adviceImage : findAdviceImageArray,
        isBookMark: boolean,
        commentcount: findOneAdvice.Comments.length,
      }
  }
}

module.exports = AdviceService;
