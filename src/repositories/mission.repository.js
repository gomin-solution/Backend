// const Mission = require("../schemas/mission");
const {
  Mission,
  AdviceMission,
  ChoiceMission,
  PostMission,
  LikeMission,
  MissionComplete,
  MsgMission,
  SelectMission,
  SolutionMission,
  MissionCompleteMission,
} = require("../models");
const { Op } = require("sequelize");

class MissionRepository {
  //미션완료 불러오기
  completeMission = async (userKey) => {
    return await MissionComplete.findAll({ where: { userKey: userKey } });
  };

  //미션 불러오기
  mission = async (unCompleteMission) => {
    return await Mission.findAll({
      where: { missionId: unCompleteMission },
      include: [
        { model: AdviceMission },
        { model: ChoiceMission },
        { model: PostMission },
        { model: LikeMission },
        { model: MsgMission },
        { model: SelectMission },
        { model: SolutionMission },
        { model: MissionCompleteMission },
      ],
    });
  };

  Postmission = async (userKey) => {
    const postmission = await PostMission.findAll({
      attribute: ["missionId"],
      include: [
        {
          model: Mission,
          include: { model: MissionComplete, where: { userKey: userKey } },
        },
      ],
    });
    console.log(postmission);
    return postmission;
  };

  //미션 완료 추가
  createCompleteMission = async (userKey, missionId) => {
    await MissionComplete.create({
      userKey: userKey,
      missionId: missionId,
      isGet: false,
    });
  };

  //미션 완료 조회
  isComplete = async (userKey, missionId) => {
    const getComplete = await MissionComplete.findOne({
      where: { userKey: userKey, missionId: missionId },
    });
    return getComplete;
  };

  //리워드 휙득하기
  getReword = async (userKey, missionId) => {
    const isGet = await MissionComplete.update(
      { isGet: 1 },
      { where: { userKey: userKey, missionId: missionId } }
    );
    return isGet;
  };
}

module.exports = MissionRepository;
