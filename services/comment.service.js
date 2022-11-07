const CommentRepository = require("../repositories/comment.repository");//리포지토리의 내용을 가져와야한다.

class CommentService{
    commentRepository = new CommentRepository();

    //덧글 달기
    createComment = async (userId, adviceId, comment) => {
        const createComment = await this.commentRepository.createComment(userId, adviceId, comment);
        return createComment
    }

    //특정 포스트의 모든 덧글을 가져옴
    // getComment =async (postId) => {
    //     const findComment = await this.commentRepository.findComment(postId);
    //     return findComment;
    // }

    //덧글 수정하기
    updateComment= async (userId, commentId, comment) => {
        const createComment = await this.commentRepository.updateComment(userId, commentId, comment);
        return createComment
    }

    //덧글 삭제하기
    deleteComment= async (commentId, userId) => {
        const createComment = await this.commentRepository.deleteComment(userId, commentId);
        return createComment
    }

}

module.exports = CommentService;