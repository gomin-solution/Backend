const ErrorCustom = require("../exceptions/error-custom");
const CommentRepository = require("../repositories/comment.repository"); //리포지토리의 내용을 가져와야한다.
const AdviceRepository = require("../repositories/advice.repository");
const MissionService = require("../services/mission.service");

const SocketIO = require("socket.io");
const server = require("../app");
const io = SocketIO(server, { path: "/socket.io" });

class CommentService {
  commentRepository = new CommentRepository();
  adviceRepository = new AdviceRepository();
  missionService = new MissionService();

  //덧글 달기
  createComment = async (userKey, adviceId, comment) => {
    const findAdvice = await this.adviceRepository.findAdvice(adviceId);
    if (findAdvice.userKey == userKey) {
      throw new ErrorCustom(
        400,
        "본인 게시글에는 대댓글만 작성 할 수 있습니다."
      );
    }
    const createComment = await this.commentRepository.createComment(
      userKey,
      adviceId,
      comment
    );

    //미션 알람
    // const missionComplete = await this.missionService.MyNewComplete(userKey);
    // if (missionComplete.length) {
    //   io.emit("complete_aram", "보상을 확인하세요");
    // }

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
    const dup = await this.commentRepository.findComment(commentId);

    if (dup.userKey === userKey) return -1;

    const isCommentLike = await this.commentRepository.isCommentLike(
      userKey,
      commentId
    );
    //취소
    if (isCommentLike) {
      const cancel = await this.commentRepository.cancelCommentLike(
        userKey,
        commentId
      );
      return cancel;
    } else {
      //등록
      const like = await this.commentRepository.createCommentLike(
        userKey,
        commentId
      );
      const commentUser = await this.commentRepository.findComment(commentId);

      //좋아요 받은 유저 미션 현황
      // const missionComplete = await this.missionService.MyNewComplete(
      //   commentUser.userKey
      // );
      // if (missionComplete.length) {
      //   io.emit("complete_aram", "보상을 확인하세요");
      // }

      return like;
    }
  };

  //덧글 좋아요 갯수
  countComment = async (commentId) => {
    const count = await this.commentRepository.countComment(commentId);
    return count;
  };

  //댓글 채택하기
  selectComment = async (userKey, commentId) => {
    const findComment = await this.commentRepository.findComment(commentId);

    if (findComment.userKey == userKey) {
      throw new ErrorCustom(400, "본인 댓글을 채택할 수 없어요.");
    }

    if (findComment.Advice.userKey !== userKey) {
      throw new ErrorCustom(400, "게시글 작성자만 채택할 수 있습니다.");
    }

    const select = await this.commentRepository.selectComment(
      userKey,
      commentId
    );

    //미션알람
    // const missionComplete = await this.missionService.MyNewComplete(
    //   findComment.userKey
    // );
    // if (missionComplete.length) {
    //   io.emit("complete_aram", "보상을 확인하세요");
    // }

    return select;
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
}

module.exports = CommentService;
