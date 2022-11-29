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

//대댓글 기능
router.post("/re/:commentId", authMiddleware, commentController.reComment);

//대댓글 가져오기
router.get("/re/:commentId", authMiddleware, commentController.getReComment);

//댓글 신고하기
router.put(
  "/report/:commentId",
  authMiddleware,
  commentController.reportComment
);

//조언 댓글 채택
router.put("/select/:commentId", authMiddleware, commentController.selectComment)

module.exports = router;
