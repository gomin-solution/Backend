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

  updateAdvice = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { adviceId } = req.params;
    const { title, content } = req.body;
    const images = req.files;
    //console.log(userKey, "유저키를 잘 받아오나")
    
    const findAdvice = await this.adviceService.findAllAdvice(adviceId)
    //console.log(findAdvice, "있는가??")

    if (userKey !== findAdvice[0].userKey) {
      return res.status(400).json({errorMessage: "권한이 없습니다."})
    }

    const findImageAdvice = await this.adviceService.findOneAdvice(userKey, adviceId)
    //console.log(findImageAdvice, "여기선 뭘 받아오나")
    const findAdviceImage1 = findImageAdvice.adviceImage[0].split("/")[4]
    const findAdviceImage2 = findImageAdvice.adviceImage[1].split("/")[4]
    console.log(findAdviceImage1, "첫번째 키 받아오나?");
    console.log(findAdviceImage2, "두번째 키 받아오나?");

    if (images) {
      const findAdviceImage = findAdvice[0].imageUrl[0].split("/")[4];
      const findAdviceLastImage = `profileimage/${findAdviceImage}`;
      //console.log(findAdviceImage, "아아아아");
      //console.log(findAdviceLastImage, "이미지 키를 잘 받아오나");
      
      try {
        const s3 = new aws.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: findAdviceLastImage,
        };

        // s3.deleteObject(params, function (err, data) {
        //   if (err) {
        //     console.log(err, err.stack);
        //   } else {
        //     res.status(200);
        //     next();
        //   }
        // });
      } catch (error) {
        next(error);
      }
    }




    await this.adviceService.updateAdvice(
      adviceId,
      title,
      content
    )


    res.status(200).json({ message:"수정 완료"})

  }
}

module.exports = AdviceController;
