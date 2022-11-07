const express = require('express');
const router = express.Router();

const AdviceCommentController = require('./advice.comment.controller');

const adviceCommentController = new AdviceCommentController;

router.post('/advice/comment/:adviceId', adviceCommentController.createComment);
//router.get('/', adviceCommentController.getComment);  //일단 이 기능이 없나?
router.put('/advice/comment/:commentId', adviceCommentController.updateComment);
router.delete;('/advice/comment/:commentId', adviceCommentController.deleteComment);

//좋아요는 잠시 보류
//router.put;('/advice/comment/like/:commentId', adviceCommentController.likeComment);

module.exports = router;

