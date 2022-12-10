const ErrorCustom = require("../exceptions/error-custom");
const CommentRepository = require("../repositories/comment.repository"); //리포지토리의 내용을 가져와야한다.
const AdviceRepository = require("../repositories/advice.repository");

const MissionService = require("../services/mission.service");

const MissionRepository = require("../repositories/mission.repository");

const admin = require("firebase-admin");

const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

class CommentService {
  commentRepository = new CommentRepository();
  adviceRepository = new AdviceRepository();

  missionService = new MissionService();

  missionRepository = new MissionRepository();

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

    await this.missionRepository.commentActivity(userKey);

    const message = {
      token: findAdvice.User.deviceToken,
      data: {
        title: "고민접기",
        body: "게시물에 댓글이 달렸습니다!",
        link: `board-advice/${adviceId}`,
      },
    };

    admin
      .messaging()
      .send(message)
      .catch(function (error) {
        console.trace(error);
      });

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

    //댓글작성자와 좋아요 시도한 자의 userKey가 같으면 에러!
    if (dup.userKey === userKey) {
      throw new Error("본인 게시글에는 좋아요를 할 수 없습니다.");
    }

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
      return { cancel, undefined };
    } else {
      //등록
      const like = await this.commentRepository.createCommentLike(
        userKey,
        commentId
      );
      const commentUser = await this.commentRepository.findComment(commentId);

      const commentUserKey = commentUser.userKey;
      //좋아요 받은 사람 횟수 +1
      await this.missionRepository.receiveLikeActivity(commentUserKey);

      return { like, commentUserKey };
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
    console.log(findComment);

    if (findComment.userKey == userKey) {
      throw new ErrorCustom(400, "본인 댓글을 채택할 수 없어요.");
    }

    if (findComment.Advice.userKey !== userKey) {
      throw new ErrorCustom(400, "게시글 작성자만 채택할 수 있습니다.");
    }

    await this.commentRepository.selectComment(userKey, commentId);

    const commentUser = await this.commentRepository.findComment(commentId);

    //채택받기 횟수 +1
    await this.missionRepository.selectActivity(commentUser.userKey);

    return commentUser.userKey;
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

    for (let i = 0; i < reply.length; i++) {
      let a = reply[i].userKey;
      let user = await this.commentRepository.getUser(a);
      let re = reply[i].dataValues;
      delete re.targetUser;
      delete re.updatedAt;
      re.updatedAt = dayjs(reply[i].updatedAt).tz().format("YYYY/MM/DD HH:mm");
      re.nickname = user.nickname;
      re.userImage = user.userImg;
    }
    return reply;
  };

  //대댓글 수정하기
  putRe = async (replyId, userKey, re) => {
    const reply = await this.commentRepository.putRe(replyId, userKey, re);
    return reply;
  };

  //대댓글 삭제하기
  deleteRe = async (replyId, userKey) => {
    //먼저 검증을 하고 삭제
    const check = await this.commentRepository.checkRe(replyId);
    if (check.userKey !== userKey) {
      return;
    }
    const data = await this.commentRepository.deleteRe(replyId, userKey);
    return data;
  };
}

module.exports = CommentService;
