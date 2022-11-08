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

    choice = async (userId, choiceId, choiceNum) => {
        
        //이전에 투표한 적이 있는지에 대한 여부
        const isChoice = await this.choiceRepository.isChoice(userId, choiceId);
        let choice
        if(isChoice){
            //투표한 적이 있다면 투표를 취소한다.
            choice = await this.choiceRepository.cancelChoice(userId, choiceId);         
        }else{
            //투표한 적이 없다면 투표를 진행한다.
            choice = await this.choiceRepository.choice(userId, choiceId, choiceNum);  
        }        

        //성공적으로 투표하면 투표현황을 리턴한다.

        //ERD가 변경되었다. 투표여부 테이블을 추가했으므로 이것을 참조해서 구현하자
        return choice;
    }


}

module.exports = ChoiceService;