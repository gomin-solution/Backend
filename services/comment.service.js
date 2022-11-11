const CommentRepository = require("../repositories/comment.repository"); //리포지토리의 내용을 가져와야한다.

class CommentService {
  commentRepository = new CommentRepository();

  //덧글 달기
  createComment = async (userKey, adviceId, comment) => {
    const createComment = await this.commentRepository.createComment(
      userKey,
      adviceId,
      comment
    );
    return createComment;
  };

  //특정 포스트의 모든 덧글을 가져옴
  // getComment =async (postId) => {
  //     const findComment = await this.commentRepository.findComment(postId);
  //     return findComment;
  // }

  //덧글 수정하기
  updateComment = async (userKey, commentId, comment) => {
    const createComment = await this.commentRepository.updateComment(
      userKey,
      commentId,
      comment
    );
    return createComment;
  };

  //덧글 삭제하기
  deleteComment = async (commentId, userKey) => {
    const createComment = await this.commentRepository.deleteComment(
      commentId,
      userKey
    );
    return createComment;
  };

  //덧글 좋아요 또는 취소
  updateCommentLike = async (userKey, commentId) => {
    const isCommentLike = await this.commentRepository.isCommentLike(
      userKey,
      commentId
    );
    if (isCommentLike) {
      const cancel = await this.commentRepository.cancelCommentLike(
        userKey,
        commentId
      );
      return cancel;
    } else {
      const like = await this.commentRepository.createCommentLike(
        userKey,
        commentId
      );
      return like;
    }
  };

  //덧글 좋아요 갯수
  countComment = async (commentId) => {
    const count = await this.commentRepository.countComment(commentId);
    return count;
  };
}

module.exports = CommentService;
