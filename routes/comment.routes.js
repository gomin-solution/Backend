const express = require('express');
const router = express.Router();

const CommentController = require('../controllers/comment.controller');

const commentController = new CommentController;

router.post('/advice/comment/:adviceId', commentController.createComment);
//router.get('/', commentController.getComment);  //일단 이 기능이 없나?
router.put('/advice/comment/:commentId', commentController.updateComment);
router.delete;('/advice/comment/:commentId', commentController.deleteComment);

//좋아요는 잠시 보류
//router.put;('/advice/comment/like/:commentId', commentController.likeComment);

module.exports = router;

