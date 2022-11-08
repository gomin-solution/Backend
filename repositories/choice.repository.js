const { User, choice, isChoice } = require('../models');
const { Op } = require('sequelize');

class ChoiceRepository {

    createchoice = async (title, choice1Name, choice2Name, endTime) => {
        const createData = await choice.create({title, choice1Name, choice2Name, endTime});
        return createData;
    }

    findAllchoice = async () => {
        const findAllchoice = await choice.findAll();
        return findAllchoice;
    }
    
    findMychoice = async (userId) => {
        const findMychoice = await choice.findByPk(userId);
        return findMychoice;
    }

    deletechoice = async (userId, choiceId) => {
        const temp = await choice.findByPk(choiceId); 
        const temp_Id = temp.userId;
        if(uesrId !== temp_Id){
            return;
        }
        const deletechoice = await choice.destroy({where: {choiceId}});
        return deletechoice;
    }

    //투표 여부 데이터 가져오기
    isChoice = async (userId, choiceId) => {
        const isChoiceData = await isChoice.findOne({
            where: {
                [Op.and]: [{ userId }, { postId }],
            },
        });
        return isChoiceData;
    }

    //선택을 한 경우, 데이터 생성
    choice = async (userId, choiceId, choiceData) => {
        const isChoiceData = await isChoice.create(userId, choiceId, choiceData);
        return isChoiceData; 
    }

    //선택을 취소한 경우, 데이터 삭제
    cancelChoice = async (userId, choiceId) =>{
        const isChoice = await isChoice.destroy({
            where: {
                [Op.and]: [{ userId }, { choiceId }],
            }
        });
        return isChoiceData; 
    }

    //투표를 완료한 경우, 해당 choice테이블에서 투표 데이터를 가져온다.

    

}

module.exports = ChoiceRepository ;