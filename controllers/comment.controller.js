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

  reportComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;
      const { why } = req.body;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인 하시기 바랍니다." });
      }

      const updateComment = await this.commentService.reportComment(
        userKey,
        commentId,
        why
      );

      if (updateComment === false) {
        return res.status(400).json({ Message: "중복된 신고 입니다." });
      }

      let mes;
      if (!updateComment) {
        mes = "뭐하자는 겁니까?"; //본인이 쓴 덧글 본인이 신고한 경우
        return res.status(400).json({ Message: mes });
      } else {
        mes = "신고 성공";
      }

      res.status(200).json({ Message: mes });
    } catch (error) {
      next(error);
    }
  };

  //대댓글 기능
  reComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const { userKey } = res.locals.user;
      const { re, route } = req.body;
      //유저키, 유저닉네임

      //re는 대댓글 내용, route는 무엇의 대댓글인지를 나타낸다.
      //만약 주 덧글의 대댓글이라면 route는 이 될 것이다.
      //참고로 route는 배열모양을 한 스트링이다. 이부분은 프론트와 조율이 필요하다.
      //우선 받아온 데이터를 서비스로 보낸다.

      const reply = await this.commentService.reComment(
        userKey,
        commentId,
        re,
        route
      );

      res.status(200).json({ data: reply });
    } catch (error) {
      next(error);
    }
  };

  //대댓글 가져오기
  getReComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;

      const reply = await this.commentService.getReComment(commentId);

      res.status(200).json({ data: reply });
    } catch (error) {
      next(error);
    }
  };

  //대댓글 수정
  putRe = async (req, res, next) => {
    try {
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

      res.status(200).json({ mes: "대댓글 수정 완료", data: reply });
    } catch (error) {
      next(error);
    }
  };

  //대댓글 삭제, 실제로 지우진 않고 삭제된 덧글입니다로 변경
  //삭제된 대댓글에 대댓글이 달린 경우를 대비하여 이런식으로 처리함
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
}
module.exports = CommentController;
