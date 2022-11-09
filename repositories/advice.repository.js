
const { Advice, AdviceBM, User, AdviceImage, Comment } = require("../models");


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
  };

  adviceHot = async (userKey) => {
    const adviceHot5 = await Advice.findAll({
      order: [["viewCount", "DESC"]],
      limit: 5,
      include: [{ model: Comment }],
    });
    return adviceHot5;
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
    const findCategiryAdvice = await Advice.findAll(
      {where: {categoryId:categoryId},
      include: [
        { model: User, attributes: ["nickname", "userImg"] },
        //{ model: AdviceBM, where: { userKey: userKey } },
      ],});
    return findCategiryAdvice;
  };

  findOneAdvice = async (userKey, adviceId) => {
    //console.log(userKey, adviceId, "잘 받아오나 보자")
    const AdviceOne = await Advice.findOne({
      where: { adviceId: adviceId },
      include:[
        {model:User, attributes: ["nickname", "userImg"] },
        {model: AdviceBM, where: { userKey: userKey }, required:false },
        {model:AdviceImage, attributes: ["adviceImage"] },
        {model:Comment}
      ]
    })
    //console.log(AdviceOne, "가자가아아하나아아")
    return AdviceOne
  }

};



module.exports = AdviceRepository;
