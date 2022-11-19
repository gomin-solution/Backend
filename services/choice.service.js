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
      const findAllChoice = await this.choiceRepository.findAllchoice();
      //바로 위에서, 모든 choice데이터를 최신순으로 가져왔다.
      //이제 이 밑으로 해줘야 할 일은 다음과 같다.

      //choiceper 값들을 횟수에서 비율로 바꾼다.
      //choiceCount 값을 추가한다.
      //로그인 한 사람은 그 게시글에 북마크를 했는지 표시한다.
      //로그인 한 사람은 그 게시글에 투표를 했는지 표시한다.
      //해당 choice의 작성자의 프로필 사진을 가져온다.

      const author = findAllChoice;
      let data = new Array();

      for (let i = 0; i < findAllChoice.length; i++) {
        const allData = findAllChoice[i];
        const authorKey = findAllChoice[i].userKey;

        const findAuthorData = await this.choiceRepository.findUserData(
          authorKey
        );
        const choiceIdforRepo = findAllChoice[i].choiceId;
        const isChoice = await this.choiceRepository.isChoiceForAll(
          Key,
          choiceIdforRepo
        );
        const isBookMark = await this.choiceRepository.isBookMark(
          Key,
          choiceIdforRepo
        );

        const a = findAllChoice[i].choice1Per;
        const b = findAllChoice[i].choice2Per;
        const sum = a + b;
        const res_a = (a / sum) * 100;
        const res_b = (b / sum) * 100;

        data[i] = {
          choiceId: allData.choiceId,
          userKey: allData.userKey,
          title: allData.title,
          choice1Name: allData.choice1Name,
          choice2Name: allData.choice2Name,
          choice1Per: Math.round(res_a),
          choice2Per: 100 - Math.round(res_a),
          userImage: findAuthorData.userImg, //
          nickname: findAuthorData.nickname, //
          createdAt: allData.createdAt,
          endTime: allData.endTime,
          choiceCount: sum,
          isBookMark: Boolean(isBookMark), //
          isChoice: Boolean(isChoice), //
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
          choice2Per: 100 - Math.round(result_a),
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
      choice2Per = 100 - Math.round(a);
      return {
        choice1Per,
        choice2Per,
        count,
      };
    }
  };
}

module.exports = ChoiceService;
