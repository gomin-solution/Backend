const ChoiceRepository = require("../repositories/choice.repository");

class ChoiceService {
    choiceRepository = new ChoiceRepository();

    createchoice = async (userKey, title, choice1Name, choice2Name, endTime) => {
        const createchoice = await this.choiceRepository.createchoice(userKey, title, choice1Name, choice2Name, endTime);
        return createchoice
    }

    findAllchoice = async () => {

        try{
            const findAllChoice = await this.choiceRepository.findAllchoice();
            const author= findAllChoice
            let data = new Array();

            //작성자의 닉네임과 유저 아이디를 가져오는 명령
            for(let i = 0 ; i<findAllChoice.length; i++) {
                const authorKey = author[i].userKey
                console.log(authorKey)
                const findAuthorData = await this.choiceRepository.findUserData(authorKey)
                console.log("또다른 구분선==96+++++++++++++")
                console.log(findAuthorData)
                console.log(findAuthorData.userImg)
                data[i] = findAuthorData
            }



            console.log("구분선=============")
            console.log(data)
            console.log("구분선=============222222")
            console.log(findAllChoice)

                //추가해야 하는 기능
            //리턴에서 userImage, nickname, isBookMark, isChoice, 추가

            //작성자자 이 투표에 참여했는가?

            //작성자가 이 투표에 북마크를 했는가?

            console.log(
                // findAllChoice.choiceId,
                // findAllChoice.userKey,
                // findAllChoice.title,
                // findAllChoice.choice1Name,
                // findAllChoice.choice1Name,
                // findAllChoice.choice1Per,
                // findAllChoice.choice2Per,

                // data.userImg,
                // data.nickname,
                // findAllChoice.createdAt,
                // findAllChoice.endTime,
            )


            return {
                choiceId: findAllChoice.choiceId,
                userKey: findAllChoice.userKey,
                title: findAllChoice.title,
                choice1Name: findAllChoice.choice1Name,
                choice2Name: findAllChoice.choice1Name,
                choice1Per: findAllChoice.choice1Per,
                choice2Per: findAllChoice.choice2Per,

                userImage: data.userImg,
                nickname: data.nickname,
                createdAt: findAllChoice.createdAt,
                endTime:findAllChoice.endTime,
                // choiceCount:,

                // isBookMark:,
                // isChoice:
            }
        }catch(err){

        }
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