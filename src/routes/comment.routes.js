const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
const reward = require("../middlewares/rewardMiddleware");

const CommentController = require("../controllers/comment.controller");
const commentController = new CommentController();

router.post("/:adviceId", auth, commentController.createComment, reward);

router.put("/:commentId", auth, commentController.updateComment);

router.delete("/:commentId", auth, commentController.deleteComment);

router.put("/like/:commentId", auth, commentController.likeComment, reward);

//대댓글 작성하기
router.post("/re/:commentId", auth, commentController.reComment);

//대댓글 가져오기
router.get("/re/:commentId", auth, commentController.getReComment);

//대댓글 수정하기
router.put("/re/:replyId", auth, commentController.putRe);

//대댓글 삭제하기
router.delete("/re/:replyId", auth, commentController.deleteRe);

//조언 댓글 채택
router.put("/select/:commentId", auth, commentController.selectComment, reward);

module.exports = router;
