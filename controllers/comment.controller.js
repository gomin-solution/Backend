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

  //좋아요를 하면 해당 데이터와 해당 덧글의 좋아요의 수를 반환한다. 단, 자신의 덧글에는 좋아요를 할 수 없다.
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

      if (Likes === -1) {
        return res
          .status(400)
          .send({ message: "자신의 덧글에는 좋아요를 할 수 없습니다." });
      }

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

  //대댓글 기능===========================================================
  //대댓글 생성 기능
  reComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;
      const { re, targetUser } = req.body;
      //re: 대댓글 내용
      //targetUser: 만약 대댓글 중에서 해당 대댓글에 답글을 달고 싶다면 그 대상의 userKey
      //targetUser는 null이 가능하다.

      const reply = await this.commentService.reComment(
        userKey,
        commentId,
        re,
        targetUser
      );

      console.log(reply);
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
      //re: 대댓글 내용
      //targetUser: 만약 대댓글 중에서 해당 대댓글에 답글을 달고 싶다면 그 대상의 userKey
      //targetUser는 null이 가능하다.

      const reply = await this.commentService.getReComment(commentId);

      res.status(200).json({ data: reply });
    } catch (err) {
      next(err);
    }
  };

  //대댓글 수정 기능
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

    res.status(200).json({ data: reply });
    try {
    } catch (err) {
      next(err);
    }
  };

  //대댓글 삭제 기능
  //실제로 삭제하진 않고 내용을 "삭제된 덧글입니다."로 바꾼다.
  deleteRe = async (req, res, next) => {
    try {
      const { replyId } = req.params;
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      const reply = await this.commentService.deleteRe(replyId, userKey);

      if (!reply) {
        res.status(400).json({ mes: "이미 삭제된 덧글 입니다." });
      }

      res.status(200).json({ mes: "대댓글 삭제 완료", data: reply });
    } catch (error) {
      next(error);
    }
  };

  //댓글 채택
  selectComment = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { commentId } = req.params;

    try {
      await this.commentService.selectComment(userKey, commentId);
      // let message = "";
      // if (selectComment) {
      //   message = "채택 성공";
      // } else {
      //   message = "채택 취소";
      // }
      res.status(200).json({ Message: "채택되었습니다." });
    } catch (err) {
      next(err);
    }
  };
}
module.exports = CommentController;
