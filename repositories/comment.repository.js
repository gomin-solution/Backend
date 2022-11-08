const { Users, Posts, Comment } = require('../models');          //모델 데이터를 가져오고

class CommentRepository {

    Comment = new Comment()

    //덧글 찾기
    // findComment = async (postId) =>{
    //     const comments = await Comment.findAll({
    //         where: { postId },
    //         include: {
    //             model: Users, 
    //             attributes: ["nickname"]
    //         },   
    //         order: [["createdAt", "DESC"]],
    //       });
    //     return comments;
    // }

    //포스트 아이디를 기반으로 포스트 찾기
    // findPostById = async (postId) => { 
    //     const post = await Posts.findByPk(postId);
    //     return post;
    // };

    //덧글 추가
    createComment = async (userId, adviceId, comment) => {
        const createCommentData = await Comment.create({userId, adviceId, comment});
        return createCommentData;
    }

    //덧글 수정
    updateComment = async (userId, commentId, comment) => {
        const data = await Comment.findByPk(commentId); 
        const dataId = data.userId  
        if(userId !== dataId){    //로그인한 사람의 id와 comment가 가진 userid가 다를 경우
            return;
        }
        const updateCommentData = await Comment.update({comment}, {where: {commentId}})
        return updateCommentData
    }

    //덧글 삭제
    deleteComment = async (userId, commentId) => {
        const data = await Comment.findByPk(commentId); 
        const dataId = data.userId 
        if(userId !== datatId){                 
            return;
        }
        const deleteCommentData = await Comment.destroy({where: {commentId}})
        return deleteCommentData
    }

}

module.exports = CommentRepository ;