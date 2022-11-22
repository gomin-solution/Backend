const { Users, Posts, Comment, CommentLike } = require("../models"); //모델 데이터를 가져오고
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
}

module.exports = CommentRepository;
