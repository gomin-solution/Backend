const AdviceService = require("../services/advice.service");
const aws = require("aws-sdk");
require("dotenv").config();

class AdviceController {
  adviceService = new AdviceService();

  creatAdvice = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { title, categoryId, content } = req.body;
    try {      
      await this.adviceService.createAdvice(
        userKey,
        title,
        categoryId,
        content,
      );
      res
        .status(200)
        .json({
          msg: "게시글 업로드 완료!!",
          title: title,
          categoryId: categoryId,
          content: content,
        });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = AdviceController;
