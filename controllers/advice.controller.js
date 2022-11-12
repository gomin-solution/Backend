const AdviceService = require("../services/advice.service");
const AdviceImageService = require("../services/adviceimage.service");
const aws = require("aws-sdk");
require("dotenv").config();

class AdviceController {
  adviceService = new AdviceService();
  adviceImageService = new AdviceImageService();

  // 조언 게시물 생성
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

      // 조언 게시물 이미지 업로드
      let imageUrl = [];
      if (images) {
        const adviceId = creatAdvice.adviceId;
        const values = Object.values({ images });
        for (let i = 0; i < values[0].length; i++) {
          imageUrl.push(values[0][i].transforms[0].location);
        }
        await this.adviceImageService.createAdviceImage(adviceId, imageUrl);
      }

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
    const allCategoryAdvice = await this.adviceService.findCategoryAdvice(
      categoryId
    );

    try {
      //전체 조회
      if (categoryId == 0) {
        return res.status(200).json({ data: allAdvice });
      }
      //카테고리별 조회
      return res.status(200).json({ data: allCategoryAdvice });
    } catch (err) {
      next(err);
    }
  };

  //상세페이지 조회
  findOneAdvice = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { adviceId } = req.params;
      const findAdvice = await this.adviceService.findOneAdvice(
        userKey,
        adviceId
      );

      await this.adviceService.upCountView(adviceId, userKey);
      res.status(200).json({ data: findAdvice });
    } catch (err) {
      next(err);
    }
  };

  // 조언 게시글 수정
  updateAdvice = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { adviceId } = req.params;
    const { title, content, imageId } = req.body;
    const images = req.files;
    const findAdvice = await this.adviceService.findAllAdvice(adviceId);

    if (userKey !== findAdvice[0].userKey) {
      return res.status(400).json({ errorMessage: "권한이 없습니다." });
    }

    try {
      const AdviceImageArray = [];
      let imageUrl = [];
      if (images) {
        const findImageAdvice = await this.adviceService.findImages(imageId);
        
        for (let i = 0; i < findImageAdvice.length; i++) {
          AdviceImageArray.push(
            "adviceimage/" + findImageAdvice[i].adviceImage.split("/")[4]
          );

          try {
            const s3 = new aws.S3({
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              region: process.env.AWS_REGION,
            });

            const params = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: AdviceImageArray[i],
            };

            s3.deleteObject(params, function (err, data) {
              if (err) {
                console.log(err, err.stack);
              } else {
                res.status(200);
                next();
              }
            });
          } catch (error) {
            next(error);
          }
        }
        await this.adviceImageService.imageDelete(imageId);

        const values = Object.values({ images });
        for (let i = 0; i < values[0].length; i++) {
          imageUrl.push(values[0][i].transforms[0].location);
        }
        await this.adviceImageService.createAdviceImage(adviceId, imageUrl);
      }

      // 타이틀 수정
      if (title) {
        await this.adviceService.updateAdviceTitle(adviceId, title);
      }

      //콘텐츠 수정
      if (content) {
        await this.adviceService.updateAdviceContent(adviceId, content);
      }

      if (!images && !title && !content) {
        return res.status(200).json({ msg: "변경할 내용이 없습니다" });
      }
      return res.status(200).json({ msg: "수정 완료!" });
    } catch (err) {
      next(err);
    }
  };

  // 조언 게시글 삭제
  deleteAdvice = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { adviceId } = req.params;
    const findAdvice = await this.adviceService.findAllAdvice(adviceId);
    
    if (userKey !== findAdvice[0].userKey) {
      return res.status(400).json({ errorMessage: "권한이 없습니다." });
    }

    try {
      const findDeleteImages = await this.adviceImageService.adviceImageFind(adviceId);
      const findDeleteImagesArray = [];
      for (let i = 0; i < findDeleteImages.length; i++) {
        findDeleteImagesArray.push(
          "adviceimage/" + findDeleteImages[i].split("/")[4]
        );
        console.log(findDeleteImagesArray)
        const s3 = new aws.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: findDeleteImagesArray[i],
        };
        
        s3.deleteObject(params, function (err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            res.status(200);
            next();
          }
        });
      }

      //게시물 삭제
      await this.adviceService.adviceDelete(adviceId);
      return res.status(200).json({msg: "게시물 삭제 완료!"})
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AdviceController;
