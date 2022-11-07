const AdviceImageService = require("../services/adviceimage.service");
const aws = require("aws-sdk");
require("dotenv").config();

class AdviceImageController {
  adviceService = new AdviceImageService();

  creatAdviceImage = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { adviceId } = req.params;
    try {
      const images = req.files;

      const values = Object.values({ images });
      //console.log(values);
      let imageLocation = [];
      for (let i = 0; i < values[0].length; i++) {
        imageLocation.push(values[0][i].transforms[0].location)
      }
      // const imageUrl1 = values[0][0].transforms[0].location;
      // const imageUrl2 = values[0][1].transforms[0].location;
      console.log(values, "아아아아아아")
      console.log(imageLocation[i])

      await this.adviceService.createAdvice(
        userKey,
        adviceId,
        imageLocation[i]
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

module.exports = AdviceImageController;
