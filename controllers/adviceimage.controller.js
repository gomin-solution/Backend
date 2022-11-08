const AdviceImageService = require("../services/adviceimage.service");
const aws = require("aws-sdk");
require("dotenv").config();

class AdviceImageController {
  adviceImageService = new AdviceImageService();

  // creatAdviceImage = async (req, res, next) => {
  //   const { adviceId } = req.params;
  //   const images = req.files;
  //   try {
  //     const values = Object.values({ images });
  //     //console.log(values);
  //     let imageUrl = [];
  //     for (let i = 0; i < values[0].length; i++) {
  //       imageUrl.push(values[0][i].transforms[0].location);
  //     }

  //     // console.log(values, "아아아아아아")
  //     // console.log(imageUrl1)

  //     await this.adviceImageService.createAdviceImage(adviceId, imageUrl);

  //     res.status(200).json({
  //       msg: "이미지 업로드 완료!",
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

module.exports = AdviceImageController;
