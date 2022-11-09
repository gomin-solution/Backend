const ChoiceRepository = require("../repositories/choice.repository");

class ChoiceService {
    choiceRepository = new ChoiceRepository();

    createchoice = async (userKey, title, choice1Name, choice2Name, endTime) => {
        const createchoice = await this.choiceRepository.createchoice(userKey, title, choice1Name, choice2Name, endTime);
        return createchoice
    }

    findAllchoice = async () => {
        const findAllchoice = await this.choiceRepository.findAllchoice();
        return findAllchoice
    }

    findMychoice = async (userKey) => {
        const findMychoice = await this.choiceRepository.findMychoice(userKey);
        return findMychoice
    }

    deletechoice = async (userKey, choiceId) => {
        const deletechoice = await this.choiceRepository.deletechoice(userKey, choiceId);
        return deletechoice
    }

    choice = async (userKey, choiceId, choiceNum) => {
        //이전에 투표한 적이 있는지에 대한 여부
        const isChoice = await this.choiceRepository.isChoice(userKey, choiceId);
        let choice
        if(isChoice){
            //투표한 적이 있다면 투표를 취소한다.
            choice = await this.choiceRepository.cancelChoice(userKey, choiceId);
            return choice;         
        }else{
            //투표한 적이 없다면 투표를 진행한다.
            choice = await this.choiceRepository.doChoice(userKey, choiceId, choiceNum);  
            //성공적으로 투표하면 투표현황을 리턴한다.
            const result = await this.choiceRepository.resultChoice(choiceId)

            let absolute_a = result.choice_1_length
            let absolute_b = result.choice_2_length
            let choice1Per
            let choice2Per
            if(absolute_a+absolute_b > 0){
                choice1Per = (absolute_a)/(absolute_a+absolute_b)*100;
                choice2Per = (absolute_b)/(absolute_a+absolute_b)*100;
            }
            let count = absolute_a + absolute_b
            return {
                // absolute_a,
                // absolute_b,
                choice1Per, 
                choice2Per,
                count
            }
        }

    }
}

module.exports = ChoiceService;