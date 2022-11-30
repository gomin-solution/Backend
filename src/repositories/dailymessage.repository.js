const { DailyMessage } = require("../models");

class DailyMsgRepository {
  allMsg = async () => {
    return await DailyMessage.findAll({});
  };
}

module.exports = DailyMsgRepository;
