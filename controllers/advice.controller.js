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

    if (userKey == 0) {
      return res.status(400).send({ message: "로그인이 필요합니다." });
    }

    const { title, categoryId, content } = req.body;
    const images = req.files;

    try {
      const creatAdvice = await this.adviceService.createAdvice(
        userKey,
        title,
        categoryId,
        content
      );

      if (images) {
        const adviceId = creatAdvice.adviceId;
        const imageUrl = images.map((url) => url.location);
        const resizeUrl = [];
        console.log(imageUrl);
        for (let i = 0; i < images.length; i++) {
          resizeUrl.push(
            images[i].location.replace(/\/adviceimage\//, "/thumb/")
          );
        }
        console.log(resizeUrl);
        await this.adviceImageService.createAdviceImage(
          adviceId,
          imageUrl,
          resizeUrl
        );
      }

      res.status(200).json({
        msg: "게시글 업로드 완료!!",
        adviceId: creatAdvice.adviceId,
      });
    } catch (error) {
      next(error);
    }
  };

  //조언 게시글조회
  allAdvice = async (req, res, next) => {
    const { categoryId, filterId } = req.params;
    const { page } = req.query;

    const allAdvice = await this.adviceService.findAllAdvice(filterId);
    const allCategoryAdvice = await this.adviceService.findCategoryAdvice(
      categoryId,
      filterId
    );

    let advice;
    let arr = [];
    if (categoryId == 0) {
      advice = chunk(allAdvice, 10)[Number(page)];
    } else {
      advice = chunk(allCategoryAdvice, 10)[Number(page)];
    }

    function chunk(data = [], size = 1) {
      arr = [];
      for (let i = 0; i < data.length; i += size) {
        arr.push(data.slice(i, i + size));
      }
      return arr;
    }

    try {
      if (!advice) {
        advice = [];
      }
      //카테고리별 조회
      return res.status(200).json({ advice });
    } catch (err) {
      next(err);
    }
  };

  //상세페이지 조회
  /*등록순, 좋아요순*/
  findOneAdvice = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { adviceId, filterId } = req.params;
      const findAdvice = await this.adviceService.findOneAdvice(
        userKey,
        adviceId,
        filterId
      );
      //console.log(findAdvice.comment)

      await this.adviceService.upCountView(adviceId, userKey);
      res.status(200).json({ findAdvice });
    } catch (err) {
      next(err);
    }
  };

  // 조언 게시글 수정
  updateAdvice = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { adviceId } = req.params;
    const { title, content, imageId } = req.body;
    if (userKey == 0) {
      return res.status(400).send({ message: "권한이 없습니다." });
    }
    const images = req.files;
    const findAdvice = await this.adviceService.findAllAdviceOne(adviceId);

    try {
      if (userKey !== findAdvice[0].userKey) {
        return res.status(400).json({ errorMessage: "권한이 없습니다." });
      }

      const AdviceImageArray = [];
      const AdviceResizeImageArray = [];
      if (images) {
        const findImageAdvice = await this.adviceService.findImages(imageId);

        for (let i = 0; i < findImageAdvice.length; i++) {
          AdviceImageArray.push(
            "adviceimage/" + findImageAdvice[i].adviceImage.split("/")[4]
          );
          AdviceResizeImageArray.push(
            "thumb/" + findImageAdvice[i].adviceImage.split("/")[4]
          );
          const totalAdviceImageArray = AdviceImageArray.concat(AdviceResizeImageArray)

          try {
            const s3 = new aws.S3({
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
              region: process.env.AWS_REGION,
            });

            const params = {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: totalAdviceImageArray[i],
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

        const imageUrl = images.map((url) => url.location);
        const resizeUrl = [];
        for (let i = 0; i < images.length; i++) {
          resizeUrl.push(
            images[i].location.replace(/\/adviceimage\//, "/thumb/")
          );
        }
        await this.adviceImageService.createAdviceImage(adviceId, imageUrl, resizeUrl);
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
    if (userKey == 0) {
      return res.status(400).send({ message: "권한이 없습니다." });
    }
    const findAdvice = await this.adviceService.findAllAdviceOne(adviceId);

    try {
      if (userKey !== findAdvice[0].userKey) {
        return res.status(400).json({ errorMessage: "권한이 없습니다." });
      }

      const findDeleteImages = await this.adviceImageService.adviceImageFind(
        adviceId
      );
      const findDeleteImagesArray = [];
      const AdviceResizeDeleteImageArray = [];
      for (let i = 0; i < findDeleteImages.length; i++) {
        findDeleteImagesArray.push(
          "adviceimage/" + findDeleteImages[i].split("/")[4]
        );
        AdviceResizeDeleteImageArray.push(
          "thumb/" + findDeleteImages[i].split("/")[4]
        );
        const totalAdviceDeleteImageArray = findDeleteImagesArray.concat(AdviceResizeDeleteImageArray)
        console.log(totalAdviceDeleteImageArray);
        const s3 = new aws.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
        });

        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: totalAdviceDeleteImageArray[i],
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
      return res.status(200).json({ msg: "게시물 삭제 완료!" });
    } catch (err) {
      next(err);
    }
  };

  /**내가쓴 조언글 가져오기 */
  myadvice = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const myadvice = await this.adviceService.myadvice(userKey);
      return res.status(200).json(myadvice);
    } catch (err) {
      next(err);
    }
  };

  reportAdvice = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { adviceId } = req.params;

    try {
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const adviceUpdate = await this.adviceService.reportAdvice(
        userKey,
        adviceId
      );

      let mes;
      if (!adviceUpdate) {
        mes = "지금 자신의 글을 신고한다고??";
      } else {
        mes = "신고";
      }

      res.status(200).json({ message: mes, adviceUpdate });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AdviceController;
