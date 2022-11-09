const AdviceService = require("../services/advice.service");
const AdviceImageService = require("../services/adviceimage.service");
const aws = require("aws-sdk");
require("dotenv").config();

class AdviceController {
  adviceService = new AdviceService();
  adviceImageService = new AdviceImageService();

  creatAdvice = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { title, categoryId, content } = req.body;
    const images = req.files;

    try {
      const creatAdvice = await this.adviceService.createAdvice(
        userKey,
        title,
        categoryId,
        content
      );

      let imageUrl = [];
      if (images) {
        const adviceId = creatAdvice.adviceId;
        const values = Object.values({ images });
        //console.log(values);
        for (let i = 0; i < values[0].length; i++) {
          imageUrl.push(values[0][i].transforms[0].location);
        }
        await this.adviceImageService.createAdviceImage(adviceId, imageUrl);
      }
      // console.log(values, "아아아아아아")
      // console.log(imageUrl1)

      res.status(200).json({
        msg: "게시글 업로드 완료!!",
        title: title,
        categoryId: categoryId,
        content: content,
        adviceImage: imageUrl,
      });
    } catch (error) {
      next(error);
    }
  };

  //조언 게시글조회
  allAdvice = async (req, res, next) => {
    //const { userKey } = res.locals.user;
    const { categoryId } = req.params;
    const allAdvice = await this.adviceService.findAllAdvice();
    const allCategoryAdvice = await this.adviceService.findCategoryAdvice(categoryId);

    try {
      //전체 조회
      if (categoryId == 0) {
        return res.status(200).json({ data: allAdvice });
      }
      //카테고리별 조회
      return res.status(200).json({ data: allCategoryAdvice })
    } catch (err) {
      next(err);
    }
  };

  findAdvice = async (req, res, next) => {
    const {userKey} = res.locals.user;
    const { adviceId } = req.params;
    const findAdvice = await this.adviceService.findOneAdvice(userKey, adviceId);
    try{
      res.status(200).json({ data: findAdvice })

    } catch(error) {
      next(err);
    }
   
  }
}

module.exports = AdviceController;
