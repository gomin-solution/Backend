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

    console.log(dup);
    console.log(userKey);

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

  //덧글 신고하기
  reportComment = async (userKey, commentId, why) => {
    //코멘트 아이디를 기반으로 작성자 아이디를 가져오고
    //신고자 ID, 작성자 ID, 신고게시글유형(덧글인지 뭔지), 신고 대상 ID를 저장
    let type = "comment";
    const author = await this.commentRepository.reportCommentAuthor(commentId);
    if (author === userKey) {
      return;
    }

    //중복 확인
    const redup = await this.commentRepository.reportRedup(
      userKey,
      author,
      commentId,
      type
    );

    if (redup[0]) {
      const dupmes = false;
      return dupmes;
    }

    //신고 됌
    const report = await this.commentRepository.reportComment(
      userKey,
      author,
      commentId,
      type,
      why
    );

    return report;
  };
}

module.exports = CommentService;
