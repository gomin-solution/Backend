const ChoiceRepository = require("../repositories/choice.repository");

class ChoiceService {
    choiceRepository = new ChoiceRepository();

    createchoice = async (title, choice1Name, choice2Name, endTime) => {
        const createchoice = await this.choiceRepository.createchoice(title, choice1Name, choice2Name, endTime);
        return createchoice
    }

    findAllchoice = async () => {
        const findAllchoice = await this.choiceRepository.findAllchoice();
        return findAllchoice
    }

    findMychoice = async (userId) => {
        const findMychoice = await this.choiceRepository.findMychoice(userId);
        return findMychoice
    }

    deletechoice = async (userId, choiceId) => {
        const deletechoice = await this.choiceRepository.deletechoice(userId, choiceId);
        return deletechoice
    }

    choice = async (userId, choiceId, choiceData) => {
        let choice
        if(choice ===1){
            choice = await this.choiceRepository.choice_1(userId, choiceId, choiceData);
        }else{
            choice = await this.choiceRepository.choice_2(userId, choiceId, choiceData);
        }       
        return choice;
    }


}

module.exports = ChoiceService;