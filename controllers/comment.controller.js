const CommentService = require("../services/comment.service");

class CommentController {
  commentService = new CommentService();

  createComment = async (req, res, next) => {
    try {
      const { adviceId } = req.params;
      const { comment } = req.body;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      if (!comment) {
        res.status(400).send({ errorMessage: "댓글 내용을 입력해주세요" }); //덧글 내용이 없다면 덧글을 입력해달라는 메시지 출력
        return;
      }
      const createComment = await this.commentService.createComment(
        userKey,
        adviceId,
        comment
      );
      res.status(201).send({ Message: "댓글 작성 완료", data: createComment });
    } catch (error) {
      next(error);
    }
  };

  updateComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { comment } = req.body;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      const updateComment = await this.commentService.updateComment(
        userKey,
        commentId,
        comment
      );

      if (!updateComment) {
        res.status(400).send({ errorMessage: "수정권한이 없습니다." });
        return;
      }
      res.status(200).json({ Message: "덧글 수정 완료" });
    } catch (error) {
      next(error);
    }
  };

  deleteComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "삭제권한이 없습니다." });
      }
      const deleteComment = await this.commentService.deleteComment(
        commentId,
        userKey
      );
      if (!deleteComment) {
        res.status(400).send({ errorMessage: "삭제권한이 없습니다." });
        return;
      }
      res.status(200).json({ Message: "덧글 삭제 완료", data: deleteComment });
    } catch (error) {
      next(error);
    }
  };

  //좋아요를 하면 해당 데이터와 해당 덧글의 좋아요의 수를 반환한다.
  likeComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      const Likes = await this.commentService.updateCommentLike(
        userKey,
        commentId
      );
      const count = await this.commentService.countComment(commentId);
      let mes = "";
      if (Likes) {
        mes = "좋아요 성공";
      } else {
        mes = "좋아요 취소";
      }
      res.status(200).json({ Message: mes, data: Likes, count: count });
    } catch (error) {
      next(error);
    }
  };

  reportComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인 하시기 바랍니다." });
      }

      const updateComment = await this.commentService.reportComment(
        userKey,
        commentId
      );

      let mes;
      if (!updateComment) {
        mes = "뭐하자는 겁니까?"; //본인이 쓴 덧글 본인이 신고한 경우
      } else {
        mes = "신고 성공";
      }

      res.status(200).json({ Message: mes, data: updateComment });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = CommentController;
