const BookMarkService = require("../services/bookmark.service");

class BookMarkController {
  bookmarkService = new BookMarkService();

  updateChoiceBM = async (req, res, next) => {
    try {
      const choiceId = req.params;
      const { userKey } = res.locals.user;

      await this.bookmarkService.updateChoiceBM(userKey, choiceId);
      res.status(200).json({ msg: "북마크 수정완료" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = BookMarkController;
