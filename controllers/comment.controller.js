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
      res.status(201).send({ data: createComment });
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
      res.status(200).json({ Message: "덧글 수정 성공" });
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
      res.status(200).json({ data: deleteComment });
    } catch (error) {
      next(error);
    }
  };

  likeComment = async (req, res, next) => {

    try {
      const { commentId } = req.params;
      const {userKey}= res.locals.user;
      const Likes = await this.likeService.updateCommentLike(userKey, commentId);    //위의 두개를 서비스로 보내고 받아온 값을
      res.status(200).json({ data: Likes });              //리스폰 상태창에 보낸다.

    }catch(error){
      next(error);
    }
  }

}
module.exports = CommentController;
