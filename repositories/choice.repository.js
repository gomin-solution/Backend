const { User, Choice, isChoice } = require('../models');
const { Op } = require('sequelize');

class ChoiceRepository {
    choice = new Choice()

    createchoice = async (userKey, title, choice1Name, choice2Name, endTime) => {
        const createData = await Choice.create({
            userKey,
            title,
            choice1Name,
            choice2Name,
            endTime,
        });
        return createData;
    };

    findAllchoice = async () => {
        const findAllchoice = await Choice.findAll();
        return findAllchoice;
    };

    findMychoice = async (userId) => {
        const findMychoice = await Choice.findByPk(userId);
        return findMychoice;
    };

    deletechoice = async (userId, choiceId) => {
        const temp = await Choice.findByPk(choiceId);
        const temp_Id = temp.userId;
        if (uesrId !== temp_Id) {
        return;
        }
    }
    //투표 여부 데이터 가져오기
    isChoice = async (userKey, choiceId) => {
        const isChoiceData = await isChoice.findOne({
            where: {
                [Op.and]: [{ userKey }, { choiceId }],
            },
        });

        console.log("투표여부를 묻는 데이터");
        console.log(isChoiceData);
        return isChoiceData;
    }

    //선택을 한 경우, 데이터 생성
    doChoice = async (userKey, choiceId, choiceNum) => {
        const isChoiceData = await isChoice.create({userKey, choiceId, choiceNum});
        return isChoiceData; 
    }

    //선택을 취소한 경우, 데이터 삭제
    cancelChoice = async (userKey, choiceId) =>{
        const isChoiceData = await isChoice.destroy({
            where: {
                [Op.and]: [{ userKey }, { choiceId }],
            }
        });
        return isChoiceData; 
    }

    //투표를 완료한 경우, 해당 choice테이블에서 투표 데이터를 가져온다.
    //choice1Per의 값은 자신의 choiceId를 가진 투표 파일 중 choiceNum이 1인 것의 수
    resultChoice= async (choiceId) =>{
        const result = await Choice.findOne({
            where: {
                [Op.and]: [{ choiceId }],
            }
        })
        const choice_1 = await isChoice.findAll({where: { choiceNum : 1}})
        const choice_2 = await isChoice.findAll({where: { choiceNum : 2}})
        const choice_1_length = choice_1.length
        const choice_2_length = choice_2.length
        return {
            choice_1_length,
            choice_2_length,
        };
    }

}

module.exports = ChoiceRepository;
