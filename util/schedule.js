const schedule = require("node-schedule");
const redisCli = require("../util/redis");
const { User, DailyMessage } = require("../models");

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 20;
// rule.minute = 1;
// rule.second = 0;
rule.tz = "Asia/Seoul";

module.exports = async () => {
  schedule.scheduleJob(rule, async () => {
    console.log("스케줄실행됨");
    const DailyArray = await DailyMessage.findAll({});
    const msgArray = DailyArray.map((x) => x.msg);
    const allUser = await User.findAll({ attributes: ["userKey"] });
    for (const item of allUser) {
      const msg = msgArray[Math.floor(Math.random() * msgArray.length)];
      console.log(msg);
      await redisCli.set(`${item.userKey}`, msg);
    }
  });
};
