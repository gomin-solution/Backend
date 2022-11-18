const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const CommentController = require("../controllers/comment.controller");
const commentController = new CommentController();

router.post("/:adviceId", authMiddleware, commentController.createComment);
//router.get('/',authMiddleware, commentController.getComment);  //일단 이 기능이 없나?
router.put("/:commentId", authMiddleware, commentController.updateComment);

router.delete("/:commentId", authMiddleware, commentController.deleteComment);

router.put("/like/:commentId", authMiddleware, commentController.likeComment);

//댓글 신고하기
router.put(
  "/report/:commentId",
  authMiddleware,
  commentController.reportComment
);

module.exports = router;
