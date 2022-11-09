const { Router } = require("express");
const bookMarkRouter = Router();
const authMiddleware = require("../middlewares/authMiddleware");

const BookmarkController = require("../controllers/bookmark.controller");
const bookmarkController = new BookmarkController();

//북마크 투표 페이지
bookMarkRouter.get(
  "/choice",
  authMiddleware,
  bookmarkController.updateChoiceBM
);

//북마크 조언 페이지
bookMarkRouter.get("/advice", authMiddleware);

//북마크 투표 등록 및 취소
bookMarkRouter.put("/choice/:choiceId", authMiddleware);

//북마크 조언 등록 및 취소
bookMarkRouter.put("/advice/:adviceId", authMiddleware);

module.exports = bookMarkRouter;
