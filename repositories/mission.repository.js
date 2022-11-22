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

  mission = async (unCompleteMission) => {
    return await Mission.findAll({
      where: { missionId: unCompleteMission },
      include: [
        { model: AdviceMission },
        { model: ChoiceMission },
        { model: PostMission },
        { model: LikeMission },
      ],
    });
  };

  createCompleteMission = async (userKey, missionId) => {
    await MissionComplete.create({
      userKey: userKey,
      missionId: missionId,
      isGet: false,
    });
  };

  isComplete = async (userKey, missionId) => {
    const getComplete = await MissionComplete.findOne({
      where: { userKey: userKey, missionId: missionId },
    });
    return getComplete;
  };

  getReword = async (userKey, missionId) => {
    const isGet = await MissionComplete.update(
      { isGet: 1 },
      { where: { userKey: userKey, missionId: missionId } }
    );
    return isGet;
  };
}

module.exports = MissionRepository;
