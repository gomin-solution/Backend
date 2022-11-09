const BookMarkService = require("../services/bookmark.service");

class BookMarkController {
  bookmarkService = new BookMarkService();

  updateChoiceBM = async (req, res, next) => {
    try {
      const { choiceId } = req.params;
      const { userKey } = res.locals.user;
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
      const updateMSG = await this.bookmarkService.updateAdviceBM(
        userKey,
        adviceId
      );
      res.status(200).json(updateMSG);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = BookMarkController;
