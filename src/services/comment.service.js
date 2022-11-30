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
    const dup = await this.commentRepository.reportCommentAuthor(commentId);

    if (dup === userKey) return -1;

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

  //대댓글 기능===========================================================
  //대댓글 생성 기능
  reComment = async (userKey, commentId, re, targetUser) => {
    const reply = await this.commentRepository.createReply(
      userKey,
      commentId,
      re,
      targetUser
    );
    return reply;
  };

  //대댓글 가져오기
  getReComment = async (commentId) => {
    const reply = await this.commentRepository.getReComment(commentId);
    return reply;
  };

  //대댓글 수정하기
  putRe = async (replyId, userKey, re) => {
    const reply = await this.commentRepository.putRe(replyId, userKey, re);
    return reply;
  };

  //대댓글 삭제하기
  deleteRe = async (replyId, userKey) => {
    const check = await this.commentRepository.checkRe(replyId);
    if (check.targetUser === "삭제") {
      return;
    }
    const data = await this.commentRepository.deleteRe(replyId, userKey);
    return data;
  };

  selectComment = async (userKey, commentId) => {
    const select = await this.commentRepository.selectComment(
      userKey,
      commentId
    );
    return select;
  };
}

module.exports = CommentService;
