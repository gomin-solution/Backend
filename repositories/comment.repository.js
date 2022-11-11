const { Users, Posts, Comment, CommentLike } = require('../models');          //모델 데이터를 가져오고
const { Op } = require('sequelize');

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
    createComment = async (userKey, adviceId, comment) => {
        const createCommentData = await Comment.create({userKey, adviceId, comment});
        return createCommentData;
    }

    //덧글 수정
    updateComment = async (userKey, commentId, comment) => {
        const data = await Comment.findByPk(commentId); 
        const dataId = data.userKey  
        if(userKey !== dataId){    //로그인한 사람의 id와 comment가 가진 userKey가 다를 경우
            return;
        }
        const updateCommentData = await Comment.update({comment}, {where: {commentId}})
        return updateCommentData
    }

    //덧글 삭제
    deleteComment = async ( commentId, userKey) => {
        console.log(commentId)
        //하위 데이터 전부 삭제
        const data = await CommentLike.destroy({
            where: {
                [Op.and]: [ { commentId }],
            },
            });
        const deleteCommentData = await Comment.destroy({where: {commentId, userKey}})

        return deleteCommentData
    }

    //좋아요 이력 확인
    isCommentLike= async (userKey, commentId) =>{
        const data = await CommentLike.findOne({
            where: {
                [Op.and]: [{ userKey }, { commentId }],
            },
        });
        return data            
    }


    //좋아요 취소
    cancelCommentLike=async (userKey, commentId)=>{
        const data = await CommentLike.destroy({
        where: {
            [Op.and]: [{ userKey }, { commentId }],
        },
        });

    }

    //좋아요 생성
    createCommentLike = async (userKey, commentId) =>{
        const data = await CommentLike.create({userKey, commentId})
        return data;    
    }

    //해당 덧글의 좋아요는 총 몇개인가?
    countComment= async (commentId) =>{
        const data = await CommentLike.findAll({where : {commentId}})
        const data_length = data.length
        return data_length; 
    }


}

module.exports = CommentRepository ;