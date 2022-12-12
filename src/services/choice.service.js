const ChoiceRepository = require("../repositories/choice.repository");

const MissionService = require("../services/mission.service");

const MissionRepository = require("../repositories/mission.repository");
const schedule = require("node-schedule");
const { DataExchange } = require("aws-sdk");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
const ErrorCustom = require("../exceptions/error-custom");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

class ChoiceService {
  choiceRepository = new ChoiceRepository();

  missionService = new MissionService();

  missionRepository = new MissionRepository();

  createchoice = async (userKey, title, choice1Name, choice2Name, endTime) => {
    const date = dayjs(endTime).tz();
    const limitDate = dayjs().tz().add(7, "day");
    const nowTime = dayjs().tz();

    if (limitDate < date || date < nowTime) {
      throw new ErrorCustom(400, "잘못된 날짜 입니다");
    }

    if (10 < choice1Name.length || 10 < choice2Name.length) {
      throw new ErrorCustom(400, "잘못된 형식입니다");
    }

    const scheduleDate = date.subtract(9, "hour").format();
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
      await this.missionRepository.choiceEndActivity(userKey);
    });

    //선택하기 게시글 작성 횟수 +1
    await this.missionRepository.postChoiceActivity(userKey);

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
        choice.isChoices.length
          ? (isChoice = choice.isChoices[0].choiceNum)
          : (isChoice = false);
        const createdAt = dayjs(choice.createdAt)
          .tz()
          .format("YYYY/MM/DD HH:mm");
        const endTime = dayjs(choice.endTime).format("YYYY/MM/DD HH:mm");
        return {
          choiceId: choice.choiceId,
          userKey: choice.userKey,
          title: choice.title,
          choice1Name: choice.choice1Name,
          choice2Name: choice.choice2Name,
          choice1: choice.choice1Per,
          choice2: choice.choice2Per,
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
        const parti = allChoice.sort(
          (a, b) => a.isEnd - b.isEnd || b.choiceCount - a.choiceCount
        );
        return parti;
      } else if (sort === "2") {
        //마감순
        const deadline = allChoice.sort(
          (a, b) =>
            a.isEnd - b.isEnd ||
            dayjs(a.endTime).valueOf() - dayjs(b.endTime).valueOf()
        );
        return deadline;
      }
      const Choices = allChoice.sort((a, b) => a.isEnd - b.isEnd);
      return Choices;
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

        const date = dayjs(findMychoice[i].createdAt)
          .tz()
          .format("YYYY/MM/DD HH:mm");
        data[i] = {
          choiceId: findMychoice[i].choiceId,
          userKey: findMychoice[i].userKey,
          title: findMychoice[i].title,
          choice1Name: findMychoice[i].choice1Name,
          choice2Name: findMychoice[i].choice2Name,
          choice1: findMychoice[i].choice1Per,
          choice2: findMychoice[i].choice2Per,
          userImage: myData.userImg,
          nickname: myData.nickname,
          createdAt: date,
          endTime: findMychoice[i].endTime,
          choiceCount: findMychoice[i].choiceCount,
          isBookMark: Boolean(isBookMark),
          isChoice: Boolean(isChoice),
          isEnd: findMychoice[i].isEnd,
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
    if (isChoice) {
      await this.choiceRepository.cancelChoice(userKey, choiceId);

      return false;
    } else {
      await this.choiceRepository.doChoice(userKey, choiceId, choiceNum);
      await this.missionRepository.choiceActivity(userKey);

      return true;
    }
  };

  early = async (choiceId, userKey) => {
    const early = await this.choiceRepository.early(choiceId, userKey);
    await this.missionRepository.choiceEndActivity(userKey);
    return early;
  };
}

module.exports = ChoiceService;
