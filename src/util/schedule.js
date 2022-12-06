const schedule = require("node-schedule");
const redisCli = require("../util/redis");
const { User, DailyMessage, DailyUpdate, Choice } = require("../models");
const ChoiceRepository = require("../repositories/choice.repository");
const MissionRepository = require("../repositories/mission.repository");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 0;
rule.minute = 0;
// rule.second = 1;

rule.tz = "Asia/Seoul";

module.exports = async () => {
  schedule.scheduleJob(rule, async () => {
    console.log("메세지 업데이트 스케줄 실행됨");
    const DailyArray = await DailyMessage.findAll({});
    const msgArray = DailyArray.map((x) => x.msg);
    const allUser = await User.findAll({ attributes: ["userKey"] });
    for (const item of allUser) {
      const msg = msgArray[Math.floor(Math.random() * msgArray.length)];
      console.log(msg);
      console.log(item.userKey);
      await redisCli.hSet(`${item.userKey}`, {
        msg: msg,
        isOpen: 0,
      });
    }
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  });

  // schedule.scheduleJob(rule, async () => {
  //   console.log("메세지 업데이트 스케줄 실행됨");
  //   const DailyArray = await DailyMessage.findAll({});
  //   const msgArray = DailyArray.map((x) => x.msg);
  //   const allUser = await User.findAll({ attributes: ["userKey"] });
  //   for (const item of allUser) {
  //     const msg = msgArray[Math.floor(Math.random() * msgArray.length)];
  //     console.log(msg);
  //     console.log(item.userKey);

  //     const foundItem = await DailyMessage.findOne({
  //       where: { userKey: item.userKey },
  //     });
  //     if (!foundItem) {
  //       // Item not found, create a new one
  //       await DailyUpdate.create({
  //         userKey: item.userKey,
  //         msg: msg,
  //         isOpen: 0,
  //       });
  //     }
  //     // Found an item, update it
  //     await DailyUpdate.update(
  //       { msg: msg, isOpen: 0 },
  //       { where: { userKey: item.userKey } }
  //     );
  //   }
  // });

  const findAllChoice = await Choice.findAll({
    attributes: ["choiceId", "endTime", "isEnd", "userKey"],
  });

  for (const choice of findAllChoice) {
    const scheduleDate = dayjs(choice.endTime).format();
    if (scheduleDate < dayjs().tz().format() && !choice.isEnd) {
      //isEnd업데이트
      await new ChoiceRepository().updateEnd(choice.choiceId);
      //작성자 마감횟수 +1
      await new MissionRepository().choiceEndActivity(choice.userKey);
    } else {
      schedule.scheduleJob(scheduleDate, async () => {
        console.log("마감 스케쥴 실행됨");
        //isEnd업데이트
        await new ChoiceRepository().updateEnd(choice.choiceId);
        //작성자 마감횟수 +1
        await new MissionRepository().choiceEndActivity(choice.userKey);
      });
    }
  }
};
