const ChoiceRepository = require("../repositories/choice.repository");
const schedule = require("node-schedule");
const { DataExchange } = require("aws-sdk");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

class ChoiceService {
  choiceRepository = new ChoiceRepository();

  createchoice = async (userKey, title, choice1Name, choice2Name, endTime) => {
    const date = dayjs(endTime);
    const scheduleDate = date.subtract(9, "hour").format();
    console.log("scheduleDate", scheduleDate);
    const createchoice = await this.choiceRepository.createchoice(
      userKey,
      title,
      choice1Name,
      choice2Name,
      date
    );
    schedule.scheduleJob(scheduleDate, async () => {
      console.log("마감 스케쥴 실행됨");
      await this.choiceRepository.updateEnd(createchoice.choiceId);
    });

    return createchoice;
  };

  findAllchoice = async (userKey, sort) => {
    try {
      const findAllChoice = await this.choiceRepository.findAllchoice(userKey);
      //데이터를 최신순으로 로드하여 choiceper값을 변환하고 count값을 추가하고
      //북마크, 투표여부를 표시하고, 작성장의 프로필 사진을 가져온다.
      //이 데이터들은 최신순, 참여순, 마감순에 따라 정렬이 가능하다.

      const allChoice = findAllChoice.map((choice) => {
        let isBookMark;
        let isChoice;
        choice.ChoiceBMs.length ? (isBookMark = true) : (isBookMark = false);
        choice.isChoices.length ? (isChoice = true) : (isChoice = false);
        const a = choice.choice1Per;
        const b = choice.choice2Per;
        const sum = a + b;
        const res_a = (a / sum) * 100;
        const createdAt = dayjs(choice.createdAt)
          .tz()
          .format("YYYY.MM.DD HH:mm");
        const endTime = dayjs(choice.endTime).format("YYYY.MM.DD HH:mm");
        return {
          choiceId: choice.choiceId,
          userKey: choice.userKey,
          title: choice.title,
          choice1Name: choice.choice1Name,
          choice2Name: choice.choice2Name,
          choice1Per: Math.round(res_a),
          choice2Per: 100 - Math.round(res_a),
          userImage: choice.User.userImg,
          nickname: choice.User.nickname,
          createdAt: createdAt,
          endTime: endTime,
          choiceCount: choice.choiceCount,
          isBookMark: isBookMark,
          isChoice: isChoice,
          isEnd: choice.isEnd,
        };
      });

      if (sort === "1") {
        const parti = allChoice.sort((a, b) => b.choiceCount - a.choiceCount);
        return parti;
      } else if (sort === "2") {
        //마감순
        const deadline = allChoice.sort((a, b) => {
          const endTimeA = dayjs(a.endTime).valueOf();
          const endTimeB = dayjs(b.endTime).valueOf();
          return endTimeA - endTimeB;
        });
        const deadline_1 = deadline.sort((a, b) => a.isEnd - b.isEnd);

        return deadline_1;
      }

      return allChoice;
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
        const date = dayjs(findMychoice[i].createdAt)
          .tz()
          .format("YYYY.MM.DD HH:mm");
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
          createdAt: date,
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

  deletechoice = async (choiceId) => {
    const deletechoice = await this.choiceRepository.deletechoice(choiceId);
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

  early = async (choiceId, userKey) => {
    const early = await this.choiceRepository.early(choiceId, userKey);
    return early;
  };
}

module.exports = ChoiceService;
