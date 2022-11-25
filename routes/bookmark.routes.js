const { Router } = require("express");
const bookMarkRouter = Router();
const authMiddleware = require("../middlewares/authMiddleware");

const BookmarkController = require("../controllers/bookmark.controller");
const bookmarkController = new BookmarkController();

//북마크 투표 페이지
bookMarkRouter.get("/", authMiddleware, bookmarkController.findBookMark);

//북마크 투표 등록 및 취소
bookMarkRouter.put(
  "/choice/:choiceId",
  authMiddleware,
  bookmarkController.updateChoiceBM
);

//북마크 조언 등록 및 취소
bookMarkRouter.put(
  "/advice/:adviceId",
  authMiddleware,
  bookmarkController.updateAdviceBM
);

module.exports = bookMarkRouter;
