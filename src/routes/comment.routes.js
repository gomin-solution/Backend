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

//대댓글 작성하기
router.post("/re/:commentId", authMiddleware, commentController.reComment);

//대댓글 가져오기
router.get("/re/:commentId", authMiddleware, commentController.getReComment);

//대댓글 수정하기
router.put("/re/:replyId", authMiddleware, commentController.putRe);

//대댓글 삭제하기
router.delete("/re/:replyId", authMiddleware, commentController.deleteRe);

//조언 댓글 채택
router.put(
  "/select/:commentId",
  authMiddleware,
  commentController.selectComment
);

module.exports = router;
