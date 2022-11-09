const express = require('express');
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const CommentController = require('../controllers/comment.controller');
const commentController = new CommentController;

router.post('/:adviceId',authMiddleware, commentController.createComment);
//router.get('/', commentController.getComment);  //일단 이 기능이 없나?
router.put('/:commentId',authMiddleware, commentController.updateComment);
router.delete('/:commentId',authMiddleware, commentController.deleteComment);

//좋아요는 잠시 보류
router.put('/like/:commentId',authMiddleware, commentController.likeComment);

module.exports = router;

