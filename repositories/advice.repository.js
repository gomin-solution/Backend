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

  // 조언 인기 게시물(메인페이지 용)
  adviceHot = async () => {
    const adviceHot5 = await Advice.findAll({
      order: [["viewCount", "DESC"]],
      limit: 3,
      include: [{ model: Comment }],
    });
    return adviceHot5;
  };

  // 조언 게시물 검색(키워드 검색)
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

  // 조언 게시물 전체 조회
  findAllAdvice = async () => {
    const findAllAdvice = await Advice.findAll({
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        //{ model: AdviceBM, where: { userKey: userKey }}, // 북마크를 받아와야하면 쓰자
      ],
    });
    return findAllAdvice;
  };

  // 조언 게시물 카테고리별 조회
  findCategoryAdvice = async (categoryId) => {
    const findCategiryAdvice = await Advice.findAll({
      where: { categoryId: categoryId },
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        //{ model: AdviceBM, where: { userKey: userKey } }, // 북마크를 받아와야하면 쓰자
      ],
    });
    return findCategiryAdvice;
  };

  //  조언 게시물 상세페이지 조회
  findOneAdvice = async (userKey, adviceId) => {
    const AdviceOne = await Advice.findOne({
      where: { adviceId },
      include: [
        { model: User, attributes: ["userKey", "nickname", "userImg"] },
        { model: AdviceBM, where: { userKey: userKey }, required: false },
        { model: AdviceImage, attributes: ["adviceImageId", "adviceImage"] },
        { model: Comment },
      ],
    });
    return AdviceOne;
  };

  // 조언 게시물 조회(리워드 용)
  findAdvice = async (adviceId) => {
    return await Advice.findByPk(adviceId);
  };

  // 이미지 찾기(조언 게시글 수정용)
  findImages = async (imageId) => {
    const imageIds = imageId.split(",");
    const findImage = await AdviceImage.findAll({
      where: { adviceImageId: imageIds },
    });
    return findImage;
  };

  // 조언 게시물 타이틀 수정
  updateAdviceTitle = async (adviceId, title) => {
    const updateAdviceTitleData = await Advice.update(
      { title: title },
      { where: { adviceId: adviceId } }
    );
    return updateAdviceTitleData;
  };

  // 조언 게시물 콘텐츠 수정
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

  //조언 게시물 삭제
  adviceDelete = async (adviceId) => {
    const adviceDelete = await Advice.destroy({
      where: { adviceId: adviceId },
    });
    return adviceDelete;
  };

  //내가 쓴 조언글 조회
  myadvice = async (userKey) => {
    return await Advice.findAll({where:{userKey:userKey}})
  }
}

module.exports = AdviceRepository;
