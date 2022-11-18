const schedule = require("node-schedule-tz");
const redisCli = require("../util/redis");
const { User, DailyMessage } = require("../models");

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 24;
// rule.minute = 7;
// rule.second = 0;
rule.tz = "Asia/Seoul";

//최소 1분단위
module.exports = async () => {
  console.log("스케줄실행됨");

  schedule.scheduleJob(rule, async () => {
    const DailyArray = await DailyMessage.findAll({});
    const msgArray = DailyArray.map((x) => x.msg);
    const allUser = await User.findAll({ attributes: ["userKey"] });
    for (const item of allUser) {
      const msg = msgArray[Math.floor(Math.random() * msgArray.length)];
      console.log(msg);
      await redisCli.set(`${item.userKey}`, msg);
      //   console.log(await redisCli.get(`${item.userKey}`));
    }
  });
};
