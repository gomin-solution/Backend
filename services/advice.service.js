const ErrorCustom = require("../exceptions/error-custom");
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
        userKey: post.userKey,
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
    const findOneAdvice = await this.adviceRepository.findOneAdvice(
      userKey,
      adviceId,
    );

    const findAdviceImageArray = findOneAdvice.AdviceImages.map(
      (post) => {return [post.dataValues.adviceImageId, post.adviceImage]}
        //let test1 = {};
        // console.log(post.dataValues.adviceImageId, "나와라~!")
        //test1[post.dataValues.adviceImageId] = post.adviceImage
        //return test1}
    );
    //console.log(findAdviceImageArray)
    // return findOneAdvice
    let boolean;
    findOneAdvice.AdviceBMs.length ? (boolean = true) : (boolean = false);
    return {
      adviceId: findOneAdvice.adviceId,
      categoryId: findOneAdvice.categoryId,
      userKey: findOneAdvice.User.userKey,
      title: findOneAdvice.title,
      content: findOneAdvice.content,
      createdAt: findOneAdvice.createdAt,
      updatedAt: findOneAdvice.updatedAt,
      userImage: findOneAdvice.User.userImg,
      nickname: findOneAdvice.User.nickname,
      adviceImage: findAdviceImageArray,
      isBookMark: boolean,
      commentcount: findOneAdvice.Comments.length,
    };
  };

  findImages = async (imageId) => {
    const findImage = await this.adviceRepository.findImages(imageId)
    return findImage
  }

  updateAdviceTitle = async (adviceId, title) => {
    const findAdvice = await this.adviceRepository.findAllAdvice(adviceId);
    console.log(findAdvice, "이게 없다고?");
    if (!findAdvice) throw new ErrorCustom(400, "게시물이 존재하지 않습니다.");

    await this.adviceRepository.updateAdviceTitle(adviceId, title);

    // const updateAdvice = await this.adviceRepository.findAllAdvice(adviceId);

    // return {
    //   adviceId: updateAdvice.adviceId,
    //   title: updateAdvice.title,
    //   createdAt: updateAdvice.createdAt,
    //   updatedAt: updateAdvice.updatedAt,
    // };
  };

  updateAdviceContent = async (adviceId, content) => {
    const findAdvice = await this.adviceRepository.findAllAdvice(adviceId);
    console.log(findAdvice, "이게 없다고?");
    if (!findAdvice) throw new ErrorCustom(400, "게시물이 존재하지 않습니다.");

    await this.adviceRepository.updateAdviceContent(adviceId, content);

    // const updateAdvice = await this.adviceRepository.findAllAdvice(adviceId);

    // return {
    //   adviceId: updateAdvice.adviceId,
    //   title: updateAdvice.title,
    //   createdAt: updateAdvice.createdAt,
    //   updatedAt: updateAdvice.updatedAt,
    // };
  };

  
}

module.exports = AdviceService;
