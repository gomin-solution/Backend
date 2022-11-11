const CommentService = require("../services/comment.service");

class CommentController {
  commentService = new CommentService();

  // getComment = async(req, res, next) => {
  //     try{
  //     const {adviceId} = req.params;//포스트의 아이디를 가져와야 함
  //     const comments = await this.commentService.findComment(adviceId);//포스트서비스의 findAllPost를 사용
  //     res.status(200).json({data:comments});//컨트롤러는 요청과 응답에 관여하니 응답만
  //     }catch(error){
  //         return res.status(500).send({ errorMessage:error.message});
  //     }
  // }

  createComment = async (req, res, next) => {
    try {
      const { adviceId } = req.params;
      const { comment } = req.body;
      const {userKey}= res.locals.user;

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
      const {userKey}= res.locals.user;

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
      const {userKey}= res.locals.user;
      const deleteComment = await this.commentService.deleteComment(
        commentId,
        userKey
      );
      if (!deleteComment) {
        res.status(400).send({ errorMessage: "삭제권한이 없습니다." });
        return;
      }
      res.status(200).json({Message: "덧글 삭제 완료", data: deleteComment });
    } catch (error) {
      next(error);
    }
  };

  //좋아요를 하면 해당 데이터와 해당 덧글의 좋아요의 수를 반환한다.
  likeComment = async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const {userKey}= res.locals.user;
      const Likes = await this.commentService.updateCommentLike(userKey, commentId);
      const count = await this.commentService.countComment(commentId)
      let mes = ""
      if(Likes){
        mes = "좋아요 성공"
      }else{
        mes = "좋아요 취소"
      }
      res.status(200).json({Message: mes, data: Likes, count: count });
    }catch(error){
      next(error);
    }
  }

}
module.exports = CommentController;
