const { Comment, CommentLike, Reply } = require("../models"); //모델 데이터를 가져오고
const { Op } = require("sequelize");
const Report = require("../schemas/report");

class CommentRepository {
  Comment = new Comment();

  //덧글 추가
  createComment = async (userKey, adviceId, comment) => {
    const createCommentData = await Comment.create({
      userKey,
      adviceId,
      comment,
    });
    return createCommentData;
  };

  //덧글 수정
  updateComment = async (userKey, commentId, comment) => {
    const data = await Comment.findByPk(commentId);
    const dataId = data.userKey;
    if (userKey !== dataId) {
      //로그인한 사람의 id와 comment가 가진 userKey가 다를 경우
      return;
    }
    const updateCommentData = await Comment.update(
      { comment },
      { where: { commentId } }
    );
    return updateCommentData;
  };

  //덧글 삭제
  deleteComment = async (commentId, userKey) => {
    console.log(commentId);
    //하위 데이터 전부 삭제
    const data = await CommentLike.destroy({
      where: {
        [Op.and]: [{ commentId }],
      },
    });
    const deleteCommentData = await Comment.destroy({
      where: { commentId, userKey },
    });

    return deleteCommentData;
  };

  //좋아요 이력 확인
  isCommentLike = async (userKey, commentId) => {
    const data = await CommentLike.findOne({
      where: {
        [Op.and]: [{ userKey }, { commentId }],
      },
    });
    return data;
  };

  //좋아요 취소
  cancelCommentLike = async (userKey, commentId) => {
    const data = await CommentLike.destroy({
      where: {
        [Op.and]: [{ userKey }, { commentId }],
      },
    });
  };

  //좋아요 생성
  createCommentLike = async (userKey, commentId) => {
    const data = await CommentLike.create({ userKey, commentId });
    return data;
  };

  //해당 덧글의 좋아요는 총 몇개인가?
  countComment = async (commentId) => {
    const data = await CommentLike.findAll({ where: { commentId } });
    const data_length = data.length;
    return data_length;
  };

  //덧글 신고하기, 이 덧글 누가 썻나? 단, 좋아요 할 때 자신에게 방지하는 용고로도 사용 가능
  reportCommentAuthor = async (commentId) => {
    const data = await Comment.findByPk(commentId);
    const dataId = data.userKey;
    return dataId;
  };

  //덧글 신고하기, 신고가 중복되는가?
  reportRedup = async (reporterId, suspectId, targetId, targetName) => {
    const data = {
      reporterId: Number(reporterId),
      suspectId: Number(suspectId),
      targetId: Number(targetId),
      targetName: targetName,
    };

    const result = await Report.find({
      ids: data,
    });

    return result;
  };

  //덧글 신고하기
  reportComment = async (reporterId, suspectId, targetId, targetName, why) => {
    const date = new Date();
    const reportId = date.valueOf();
    const commentId = targetId;
    const data = await Comment.findByPk(commentId);
    const content = data.comment;
    const createdAt = date;
    const updatedAt = date;

    const result = await Report.create({
      reportId,
      ids: {
        reporterId: Number(reporterId),
        suspectId: Number(suspectId),
        targetId: Number(targetId),
        targetName: targetName,
      },
      why,
      content: {
        content: content,
      },
      createdAt,
      updatedAt,
    });
    return result;
  };
  //여기서부터 대댓글 기능===============
  //덧글 데이터 가져오기
  infoComment = async (commentId) => {
    const data = await Comment.findOne({
      where: {
        [Op.and]: [{ commentId }],
      },
    });
    return data;
  };

  //대댓글 데이터 가져오기
  //라우트값이 없다면 주 댓글에 대댓글이 달린다.
  infoReply = async (commentId, route) => {
    if (route) {
      const data = await Reply.findAll({
        where: {
          [Op.and]: [{ commentId }, { route }],
        },
      });
      return data;
    } else {
      const data = await Reply.findAll({
        where: {
          [Op.and]: [{ commentId }],
        },
      });
      return data;
    }
  };

  //특정 배열 길이의 대댓글을 가져오기
  replyByLength = async (commentId, count) => {
    const data = await Reply.findAll({
      where: {
        [Op.and]: [{ commentId }, { count: count }],
      },
    });
    return data;
  };

  //대댓글 생성하기
  createReply = async (userKey, commentId, route, count, comment) => {
    const data = await Reply.create({
      userKey,
      commentId,
      route,
      count,
      comment,
    });
    return data;
  };

  //길이가 하나일때, 데이터 가져오기
  topReply = async (commentId) => {
    const data = await Reply.findAll({
      where: {
        [Op.and]: [{ commentId }, { count: 1 }],
      },
    });
    return data;
  };

  //해당 코멘트의 전체 대댓글 가져오기
  getReComment = async (commentId) => {
    const data = await Reply.findAll({
      where: {
        [Op.and]: [{ commentId }],
      },
    });
    return data;
  };

  checkRe = async (replyId) => {
    const data = await Reply.findOne({
      where: {
        [Op.and]: [{ replyId }],
      },
    });
    return data;
  };

  putRe = async (replyId, userKey, re) => {
    const putRe = await Reply.update({ comment: re }, { where: { replyId } });
    return putRe;
  };

  deleteRe = async (replyId, userKey) => {
    const comment = "삭제된 덧글입니다.";
    const deleteRe = await Reply.update({ comment }, { where: { replyId } });
    return deleteRe;
  };
}

module.exports = CommentRepository;
