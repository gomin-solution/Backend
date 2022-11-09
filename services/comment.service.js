const CommentRepository = require("../repositories/comment.repository");//리포지토리의 내용을 가져와야한다.

class CommentService{
    commentRepository = new CommentRepository();

    //덧글 달기
    createComment = async (userKey, adviceId, comment) => {
        const createComment = await this.commentRepository.createComment(userKey, adviceId, comment);
        return createComment
    }

    //특정 포스트의 모든 덧글을 가져옴
    // getComment =async (postId) => {
    //     const findComment = await this.commentRepository.findComment(postId);
    //     return findComment;
    // }

    //덧글 수정하기
    updateComment= async (userKey, commentId, comment) => {
        const createComment = await this.commentRepository.updateComment(userKey, commentId, comment);
        return createComment
    }

    //덧글 삭제하기
    deleteComment= async (commentId, userKey) => {
        const createComment = await this.commentRepository.deleteComment(commentId, userKey);
        return createComment
    }

    //덧글 좋아요 또는 취소
    updateCommentLike= async (userKey, commentId) => {

        //우선 리포에 좋아요를 한 이력이 있는지부터 찾아보고
        const isCommentLike = await this.commentRepository.isCommentLike(userKey,commentId)


        //있다면 리포에 좋아요데이터를 삭제하도록 지시하고
        //없다면 리포에 좋아요데이터를 생성하도록 지시

        if (isCommentLike){
            const cancel = await this.commentRepository.cancelCommentLike(userKey,commentId)
            return cancel;
        }else{
            const like = await this.commentRepository.createCommentLike(userKey,commentId);
            return like
        }

    }

}

module.exports = CommentService;