//const { User, Vote } = require('../db/models');          //모델 데이터를 가져와야함

class VoteRepository {

    createVote = async (title, choice1Name, choice2Name, endTime) => {
        const createData = await Vote.create({title, choice1Name, choice2Name, endTime});
        return createData;
    }

    findAllVote = async () => {
        const findAllVote = await Vote.findAll();
        return findAllVote;
    }
    
    findMyVote = async (userId) => {
        const findMyVote = await Vote.findByPk(userId);
        return findMyVote;
    }

    deleteVote = async (userId, choiceId) => {
        const temp = await Vote.findByPk(choiceId); 
        const temp_Id = temp.userId;
        if(uesrId !== temp_Id){
            return;
        }
        const deleteVote = await Vote.destroy({where: {choiceId}});
        return deleteVote;
    }


}

module.exports = VoteRepository ;