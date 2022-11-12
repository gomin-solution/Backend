// const Mission = require("../schemas/mission");
const {
  Mission,
  AdviceMission,
  ChoiceMission,
  PostMission,
  LikeMission,
  MissionComplete,
} = require("../models");
const { Op } = require("sequelize");

class MissionRepository {
  completeMission = async (userKey) => {
    return await MissionComplete.findAll({ where: { userKey: userKey } });
  };

  mission = async (CompleteMission) => {
    return await Mission.findAll({
      where: { missionId: CompleteMission },
      include: [
        { model: AdviceMission },
        { model: ChoiceMission },
        { model: PostMission },
        { model: LikeMission },
      ],
    });
  };
}

module.exports = MissionRepository;
