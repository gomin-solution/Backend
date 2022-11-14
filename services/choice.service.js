const ChoiceRepository = require("../repositories/choice.repository");

class ChoiceService {
  choiceRepository = new ChoiceRepository();

  createchoice = async (userKey, title, choice1Name, choice2Name, endTime) => {
    const createchoice = await this.choiceRepository.createchoice(
      userKey,
      title,
      choice1Name,
      choice2Name,
      endTime
    );
    return createchoice;
  };

  findAllchoice = async (Key) => {
    try {
      console.log("서비스 시작=====");
      const findAllChoice = await this.choiceRepository.findAllchoice();
      const author = findAllChoice;
      let data = new Array();

      for (let i = 0; i < findAllChoice.length; i++) {
        const authorKey = author[i].userKey;
        const findOneChoice = await this.choiceRepository.findOneData(i);
        const findAuthorData = await this.choiceRepository.findUserData(
          authorKey
        );
        const choiceIdforRepo = findOneChoice.choiceId;
        const isChoice = await this.choiceRepository.isChoiceForAll(
          Key,
          choiceIdforRepo
        );
        const isBookMark = await this.choiceRepository.isBookMark(
          Key,
          choiceIdforRepo
        );

        const a = findOneChoice.choice1Per;
        const b = findOneChoice.choice2Per;
        const sum = a + b;
        const res_a = (a / sum) * 100;
        const res_b = (b / sum) * 100;

        data[i] = {
          choiceId: findOneChoice.choiceId,
          userKey: findOneChoice.userKey,
          title: findOneChoice.title,
          choice1Name: findOneChoice.choice1Name,
          choice2Name: findOneChoice.choice2Name,
          choice1Per: Math.round(res_a),
          choice2Per: Math.round(res_b),
          userImage: findAuthorData.userImg,
          nickname: findAuthorData.nickname,
          createdAt: findOneChoice.createdAt,
          endTime: findOneChoice.endTime,
          choiceCount: findOneChoice.choiceCount,
          isBookMark: Boolean(isBookMark),
          isChoice: Boolean(isChoice),
        };
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  findMychoice = async (userKey) => {
    try {
      const findMychoice = await this.choiceRepository.findMychoice(userKey);
      let data = new Array();
      for (let i = 0; i < findMychoice.length; i++) {
        const myData = await this.choiceRepository.myData(userKey);

        const isChoice = await this.choiceRepository.isChoiceForAll(
          userKey,
          findMychoice[i].choiceId
        );
        const isBookMark = await this.choiceRepository.isBookMark(
          userKey,
          findMychoice[i].choiceId
        );

        let absolute_a = findMychoice[i].choice1Per;
        let absolute_b = findMychoice[i].choice2Per;
        let sum = absolute_a + absolute_b;
        let result_a = (absolute_a / sum) * 100;
        let result_b = (absolute_b / sum) * 100;

        data[i] = {
          choiceId: findMychoice[i].choiceId,
          userKey: findMychoice[i].userKey,
          title: findMychoice[i].title,
          choice1Name: findMychoice[i].choice1Name,
          choice2Name: findMychoice[i].choice2Name,
          choice1Per: Math.round(result_a),
          choice2Per: Math.round(result_b),
          userImage: myData.userImg,
          nickname: myData.nickname,
          createdAt: findMychoice[i].createdAt,
          endTime: findMychoice[i].endTime,
          choiceCount: findMychoice[i].choiceCount,
          isBookMark: Boolean(isBookMark),
          isChoice: Boolean(isChoice),
        };
      }
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  deletechoice = async (userKey, choiceId) => {
    const deletechoice = await this.choiceRepository.deletechoice(
      userKey,
      choiceId
    );
    return deletechoice;
  };

  choice = async (userKey, choiceId, choiceNum) => {
    const isChoice = await this.choiceRepository.isChoice(userKey, choiceId);
    let choice;
    if (isChoice) {
      choice = await this.choiceRepository.cancelChoice(userKey, choiceId);
      return choice;
    } else {
      choice = await this.choiceRepository.doChoice(
        userKey,
        choiceId,
        choiceNum
      );
      const result = await this.choiceRepository.resultChoice(choiceId);

      let absolute_a = result.choice_1;
      let absolute_b = result.choice_2;
      let choice1Per;
      let choice2Per;
      let a;
      let b;
      if (absolute_a + absolute_b > 0) {
        a = (absolute_a / (absolute_a + absolute_b)) * 100;
        b = (absolute_b / (absolute_a + absolute_b)) * 100;
      }
      let count = result.choiceCount;
      choice1Per = Math.round(a);
      choice2Per = Math.round(b);
      return {
        choice1Per,
        choice2Per,
        count,
      };
    }
  };
}

module.exports = ChoiceService;
