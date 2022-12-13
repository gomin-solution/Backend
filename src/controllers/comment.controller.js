const CommentService = require("../services/comment.service");
const AdviceService = require("../services/advice.service");

class CommentController {
  commentService = new CommentService();
  adviceService = new AdviceService();

  createComment = async (req, res, next) => {
    try {
      const { adviceId } = req.params;
      const { comment } = req.body;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      if (!comment) {
        res.status(400).send({ errorMessage: "댓글 내용을 입력해주세요" });
        return;
      }
      const createComment = await this.commentService.createComment(
        userKey,
        adviceId,
        comment
      );
      next(userKey);
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

  //자신의 덧글에는 좋아요를 할 수 없다.
  likeComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      const { like, commentUserKey } =
        await this.commentService.updateCommentLike(userKey, commentId);

      const count = await this.commentService.countComment(commentId);

      if (like !== -1 && commentUserKey) {
        next(commentUserKey);
        res
          .status(200)
          .json({ Message: "좋아요 성공", data: like, count: count });
      }
      if (like !== -1 && !commentUserKey) {
        next();
        res
          .status(200)
          .json({ Message: "좋아요 취소", data: like, count: count });
      }
    } catch (error) {
      next(error);
    }
  };

  //댓글 채택
  selectComment = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { commentId } = req.params;

    try {
      const selectComment = await this.commentService.selectComment(
        userKey,
        commentId
      );

      next(selectComment);
      res.status(200).json({ Message: "채택되었습니다." });
    } catch (err) {
      next(err);
    }
  };

  //대댓글 생성
  reComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;
      const { re, targetUser } = req.body;

      const reply = await this.commentService.reComment(
        userKey,
        commentId,
        re,
        targetUser
      );
      res.status(200).json({ data: reply });
    } catch (err) {
      next(err);
    }
  };

  //대댓글 가져오기
  getReComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;

      const reply = await this.commentService.getReComment(commentId);

      res.status(200).json({ data: reply });
    } catch (err) {
      next(err);
    }
  };

  //대댓글 수정
  putRe = async (req, res, next) => {
    const { replyId } = req.params;
    const { userKey } = res.locals.user;
    const { re } = req.body;

    if (userKey == 0) {
      return res.status(400).send({ message: "로그인이 필요합니다." });
    }

    const reply = await this.commentService.putRe(replyId, userKey, re);

    if (!reply) {
      res.status(400).json({ mes: "삭제된 덧글 입니다." });
    }

    res.status(200).json({ mes: "수정 성공", data: reply });
    try {
    } catch (err) {
      next(err);
    }
  };

  //대댓글 삭제
  deleteRe = async (req, res, next) => {
    try {
      const { replyId } = req.params;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      const reply = await this.commentService.deleteRe(replyId, userKey);

      if (!reply) {
        res.status(400).json({ mes: "권한이 없습니다." });
      }

      res.status(200).json({ mes: "대댓글 삭제 완료", data: reply });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = CommentController;
