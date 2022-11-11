const { Advice, AdviceBM, User, AdviceImage, Comment } = require("../models");
const { Op } = require("sequelize");

class AdviceRepository {
  //조언 게시글 업로드
  createAdvice = async (userKey, title, categoryId, content) => {
    const createAdvice = await Advice.create({
      userKey: userKey,
      title: title,
      categoryId: categoryId,
      content: content,
      viewCount: 0,
    });
    return createAdvice;
  };

  adviceHot = async () => {
    const adviceHot5 = await Advice.findAll({
      order: [["viewCount", "DESC"]],
      limit: 5,
      include: [{ model: Comment }],
    });
    return adviceHot5;
  };

  adviceSearch = async (keyword) => {
    const searchResult = await Advice.findAll({
      where: {
        title: {
          [Op.like]: "%" + keyword + "%",
        },
      },
      include: [{ model: Comment }],
    });
    return searchResult;
  };

  findAllAdvice = async () => {
    const findAllAdvice = await Advice.findAll({
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        //{ model: AdviceBM, where: { userKey: userKey }},
      ],
    });
    return findAllAdvice;
  };

  findCategoryAdvice = async (categoryId) => {
    const findCategiryAdvice = await Advice.findAll({
      where: { categoryId: categoryId },
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        //{ model: AdviceBM, where: { userKey: userKey } },
      ],
    });
    return findCategiryAdvice;
  };

  findOneAdvice = async (userKey, adviceId) => {
    //console.log(userKey, adviceId, "잘 받아오나 보자")
    const AdviceOne = await Advice.findOne({
      where: { adviceId },
      include: [
        { model: User, attributes: ["userKey", "nickname", "userImg"] },
        { model: AdviceBM, where: { userKey: userKey }, required: false },
        { model: AdviceImage, attributes: ["adviceImageId", "adviceImage"] },
        { model: Comment },
      ],
    });
    //console.log(AdviceOne, "가자가아아하나아아")
    return AdviceOne;
  };

  findAdvice = async (adviceId) => {
    return await Advice.findByPk(adviceId);
  };

  findImages = async (imageId) => {
    const imageIds = imageId.split(",");
    const findImage = await AdviceImage.findAll({
      where: { adviceImageId: imageIds },
    });
    //console.log(findImage, "잘 나오나")
    return findImage;
  };

  updateAdviceTitle = async (adviceId, title) => {
    const updateAdviceTitleData = await Advice.update(
      { title: title },
      { where: { adviceId: adviceId } }
    );
    return updateAdviceTitleData;
  };

  updateAdviceContent = async (adviceId, content) => {
    const updateAdviceContentData = await Advice.update(
      { content: content },
      { where: { adviceId: adviceId } }
    );
    return updateAdviceContentData;
  };

  upCountView = async (adviceId) => {
    await Advice.increment({ viewCount: 1 }, { where: { adviceId: adviceId } });
  };
}

module.exports = AdviceRepository;
