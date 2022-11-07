const AdviceService = require("../services/advice.service");
const aws = require("aws-sdk");
require("dotenv").config();

class AdviceController {
  adviceService = new AdviceService();

  creatAdvice = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { title, categoryId, content } = req.body;
    try {
      const images = req.files;

      const values = Object.values({ images });
      // console.log(values);
      // let imageLocation = [];
      // for (let i = 0; i < values[0].length; i++) {
      //   imageLocation.push(values[0][i].transforms[0].location)
      // }
      const imageUrl1 = values[0][0].transforms[0].location;
      const imageUrl2 = values[0][1].transforms[0].location;
      // console.log(values, "으아아아")
      // console.log(imageUrl1, "1번 url입니다.")
      // console.log(imageUrl2, "2번 url입니다.")

      await this.adviceService.createAdvice(
        userId,
        title,
        categoryId,
        content,
        imageUrl1,
        imageUrl2
      );

      res
        .status(200)
        .json({
          msg: "이미지 업로드 완료!",
          Adviceimg1: imageUrl1,
          Adviceimg2: imageUrl2,
        });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AdviceController;
