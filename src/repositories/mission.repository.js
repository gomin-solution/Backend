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
  UserActivity,
} = require("../models");
const { Op } = require("sequelize");

class MissionRepository {
  //미션완료 불러오기
  completeMission = async (userKey) => {
    return await MissionComplete.findAll({
      where: { userKey: userKey },
    });
  };

  //미완료 미션 불러오기
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

  //모든 미션 불러오기
  findAllMission = async () => {
    return await Mission.findAll();
  };

  Postmission = async (userKey) => {
    const postmission = await PostMission.findAll({
      attributes: ["missionId"],
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

  //답해주기 게시글 작성 횟수 +1
  postAdviceActivity = async (userKey) => {
    await UserActivity.increment(
      { postAdviceCount: 1 },
      { where: { userKey: userKey } }
    );
    return;
  };

  //메세지 오픈 횟수 +1
  messageOpenActivity = async (userKey) => {
    return await UserActivity.increment(
      { msgOpenCount: 1 },
      { where: { userKey: userKey } }
    );
  };

  //조언해주기 댓글 작성 횟수 +1
  commentActivity = async (userKey) => {
    await UserActivity.increment(
      { commentCount: 1 },
      { where: { userKey: userKey } }
    );
    return;
  };

  //골라주기 마감시 +1
  choiceEndActivity = async (userKey) => {
    await UserActivity.increment(
      { choiceCount: 1 },
      { where: { userKey: userKey } }
    );
    return;
  };

  choiceActivity = async (userKey) => {
    await UserActivity.increment(
      { choiceCount: 1 },
      { where: { userKey: userKey } }
    );
    return;
  };
  //선택하기 게시글 작성 횟수 +1
  postChoiceActivity = async (userKey) => {
    await UserActivity.increment(
      { postChoiceCount: 1 },
      { where: { userKey: userKey } }
    );
    return;
  };

  //좋아요 받기
  receiveLikeActivity = async (userKey) => {
    await UserActivity.increment(
      { receiveLikeCount: 1 },
      { where: { userKey: userKey } }
    );
    return;
  };

  //채택받기
  selectActivity = async (userKey) => {
    await UserActivity.increment(
      { selectCount: 1 },
      { where: { userKey: userKey } }
    );

    return;
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
