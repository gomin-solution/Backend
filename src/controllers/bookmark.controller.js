const BookMarkService = require("../services/bookmark.service");

class BookMarkController {
  bookmarkService = new BookMarkService();

  updateChoiceBM = async (req, res, next) => {
    try {
      const { choiceId } = req.params;
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const updateMSG = await this.bookmarkService.updateChoiceBM(
        userKey,
        choiceId
      );
      res.status(200).json(updateMSG);
    } catch (err) {
      next(err);
    }
  };

  updateAdviceBM = async (req, res, next) => {
    try {
      const { adviceId } = req.params;
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const updateMSG = await this.bookmarkService.updateAdviceBM(
        userKey,
        adviceId
      );
      res.status(200).json(updateMSG);
    } catch (err) {
      next(err);
    }
  };

  findBookMark = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      const findBmchoice = await this.bookmarkService.findBmChoice(userKey);
      const findBmAdvice = await this.bookmarkService.findBmAdvice(userKey);

      res.status(200).json({ choice: findBmchoice, advice: findBmAdvice });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = BookMarkController;
