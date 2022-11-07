const VoteRepository = require("./vote.repository");

class VoteService {
    voteRepository = new VoteRepository();

    createVote = async (title, choice1Name, choice2Name, endTime) => {
        const createVote = await this.voteRepository.createVote(title, choice1Name, choice2Name, endTime);
        return createVote
    }

    findAllVote = async () => {
        const findAllVote = await this.voteRepository.findAllVote();
        return findAllVote
    }

    findMyVote = async (userId) => {
        const findMyVote = await this.voteRepository.findMyVote(userId);
        return findMyVote
    }

    deleteVote = async (userId, choiceId) => {
        const deleteVote = await this.voteRepository.deleteVote(userId, choiceId);
        return deleteVote
    }



}

module.exports = VoteService;