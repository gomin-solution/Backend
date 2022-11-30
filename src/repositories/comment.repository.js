const { Comment, CommentLike, Reply, CommentSelect } = require("../models"); //모델 데이터를 가져오고
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

  //대댓글 생성
  createReply = async (userKey, commentId, comment, targetUser) => {
    const data = await Reply.create({
      userKey,
      commentId,
      comment,
      targetUser,
    });
    return data;
  };

  //대댓글 가져오기
  getReComment = async (commentId) => {
    const data = await Reply.findAll({
      where: {
        [Op.and]: [{ commentId }],
      },
    });
    return data;
  };

  //대댓글 수정하기
  putRe = async (replyId, userKey, re) => {
    const putRe = await Reply.update({ comment: re }, { where: { replyId } });
    return putRe;
  };

  checkRe = async (replyId) => {
    const data = await Reply.findOne({
      where: {
        [Op.and]: [{ replyId }],
      },
    });
    return data;
  };

  //대댓글 삭제하기
  deleteRe = async (replyId, userKey) => {
    const comment = "삭제된 덧글입니다.";
    const targetUser = "삭제";
    const deleteRe = await Reply.update(
      { comment, targetUser },
      { where: { replyId } }
    );
    return deleteRe;
  };

  selectComment = async (userKey, commentId) => {
    const data = await CommentSelect.create({ userKey, commentId });
    return data;
  };
}

module.exports = CommentRepository;
