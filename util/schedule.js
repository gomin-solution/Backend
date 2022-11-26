const schedule = require("node-schedule");
const redisCli = require("../util/redis");
const { User, DailyMessage } = require("../models");
const dayjs = require("dayjs");

const rule = new schedule.RecurrenceRule();
// rule.dayOfWeek = [0, new schedule.Range(0, 6)];
// rule.hour = 0;
// rule.minute = 0;
rule.second = 1;

rule.tz = "Asia/Seoul";

const date = dayjs("2022-11-26 01:36").format("YYYY-MM-DD HH:mm");

module.exports = async () => {
  schedule.scheduleJob(date, async () => {
    console.log("메세지 업데이트 스케줄 실행됨");
    const DailyArray = await DailyMessage.findAll({});
    const msgArray = DailyArray.map((x) => x.msg);
    const allUser = await User.findAll({ attributes: ["userKey"] });
    for (let i = 0; i < 10; i++) {
      for (const item of allUser) {
        const msg = msgArray[Math.floor(Math.random() * msgArray.length)];
        console.log(msg);
        console.log(item.userKey);
        await redisCli.hSet(`${item.userKey}`, {
          msg: msg,
          isOpen: 0,
        });
      }
    }
    console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  });
};
