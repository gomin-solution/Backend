const AdviceService = require("../services/advice.service");
const AdviceImageService = require("../services/adviceimage.service");
const aws = require("aws-sdk");
require("dotenv").config();

class AdviceController {
  adviceService = new AdviceService();
  adviceImageService = new AdviceImageService();

  creatAdvice = async (req, res, next) => {
    console.log(res.locals.user);
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

  allAdvice = async (req, res, next) => {
    const categoryNum = req.params;
    try {
        const allAdvice = await this.adviceService.findAllAdvice();
        res.status(200).json({ data: allAdvice });

    } catch (err) {
      next(err);
    }
  };

  //조언 게시글 검색

  // 조언 게시글 수정
}

module.exports = AdviceController;
