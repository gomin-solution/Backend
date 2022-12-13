const UserRepository = require("../repositories/users.repository.js");
const MissionRepository = require("../repositories/mission.repository");
const CommentRepository = require("../repositories/comment.repository.js");
const admin = require("firebase-admin");
const redisCli = require("../util/redis");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

module.exports = async (userKey, req, res, next) => {
  try {
    if (userKey?.name) {
      next(userKey);
    }
    /**유저의 활동 정보를 모두 가져옴 */
    const totalReword = await new UserRepository().totalReword(userKey);

    const Selects = await new CommentRepository().userSelect(userKey);

    /**내가 받은 총 좋아요수 */
    const likeTotal = totalReword.receiveLikeCount;

    /** 내가 조언해준 횟수*/
    const totalAdviceComment = totalReword.commentCount;

    /**내가 투표한횟수 */
    const totalChoicePick = totalReword.choiceCount;

    /**내가 쓴 조언게시글 수 */
    const totalAdvice = totalReword.postAdviceCount;

    /**투표 게시글 작성 수 */
    const totalChoice = totalReword.postChoiceCount;

    /**마감된 투표 게시글 수 */
    const totalEndChoice = totalReword.choiceEndCount;

    /**총게시글 작성 수 */
    const totalPost = totalAdvice + totalChoice;

    /**행운의 편지 열기 횟수 */
    const totalOpen = totalReword.msgOpenCount;

    /**채택받은 횟수 */
    const totalSelected = totalReword.selectCount;

    /**채택한 횟수 */
    const totalSelect = Selects.length;

    /**고민 마감 횟수 */
    const totalSolution = totalSelect + totalEndChoice;

    /**모든 미션Id */
    const missionarray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    /**완료한 미션 */
    let completedMission = await new MissionRepository().completeMission(
      userKey
    );

    /**완료한 미션 ID */
    const CompleteMission = completedMission.map((x) => x.missionId);

    /**미완료 미션ID */
    const unCompleteMission = missionarray.filter(
      (x) => !CompleteMission.includes(x)
    );

    /**미완료 미션을 가져와 기준에 충족하면 newCompleteMissonId 배열에 추가*/
    const mission = await new MissionRepository().mission(unCompleteMission);

    /**새로 완료한 미션이 담긴 배열 */
    const newCompleteMissionId = [];
    mission.forEach((mission) => {
      //**게시글 작성 미션 */
      const Postmission = mission.PostMission?.postMission <= totalPost;

      /** 투표하기 미션 */
      const Choicemission =
        mission.ChoiceMission?.choiceMission <= totalChoicePick;

      /**답해주기 게시글 미션 */
      const Advicemission =
        mission.AdviceMission?.adviceMission <= totalAdviceComment;

      /**좋아요 받기 미션 */
      const Likemission = mission.LikeMission?.likeMission <= likeTotal;

      /**채택받기 미션 */
      const Selectedmission =
        mission.SelectMission?.selectMission <= totalSelected;

      /**행운 메제시 열기 미션 */
      const Msgmission = mission.MsgMission?.msgMission <= totalOpen;

      /**해결한 고민 미션 */
      const Solutionmission =
        mission.SolutionMission?.solutionMission <= totalSolution;

      /**완료한 미션 */
      const MissionComplete =
        mission.MissionCompleteMission?.completeMission <=
        CompleteMission.length;

      //미션 조건 충족시 미션완료 배열에 미션 ID추가
      if (mission.missionId == 1) {
        Postmission ? newCompleteMissionId.push(mission.missionId) : false;
      }

      if (mission.missionId == 2 || mission.missionId == 3) {
        Choicemission && Advicemission
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 4) {
        Choicemission && Advicemission && Postmission
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 5) {
        Likemission && Selectedmission
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 6) {
        Postmission && Choicemission && Likemission
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 7) {
        Msgmission ? newCompleteMissionId.push(mission.missionId) : false;
      }
      if (mission.missionId == 8 || mission.missionId == 10) {
        Selectedmission ? newCompleteMissionId.push(mission.missionId) : false;
      }
      if (mission.missionId == 9) {
        Solutionmission ? newCompleteMissionId.push(mission.missionId) : false;
      }
      if (mission.missionId == 11) {
        Likemission ? newCompleteMissionId.push(mission.missionId) : false;
      }
      if (mission.missionId == 12) {
        MissionComplete ? newCompleteMissionId.push(mission.missionId) : false;
      }
    });

    for (const missionId of newCompleteMissionId) {
      await new MissionRepository().createCompleteMission(userKey, missionId);
    }

    const missionCompleteId = await new MissionRepository().completeMission(
      userKey
    );

    if (3 <= missionCompleteId.length && missionCompleteId.length < 6) {
      const image =
        "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage/grade2.png";
      const gradeKeyword = "프로 해결사";
      await new UserRepository().upGradeUser(image, gradeKeyword, userKey);
    }

    if (6 <= missionCompleteId.length && missionCompleteId.length < 10) {
      const image =
        "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage/grade3.png";
      const gradeKeyword = "엘리트 해결사";
      await new UserRepository().upGradeUser(image, gradeKeyword, userKey);
    }

    if (10 <= missionCompleteId.length) {
      const image =
        "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage/grade4.png";
      const gradeKeyword = "마스터 해결사";
      await new UserRepository().upGradeUser(image, gradeKeyword, userKey);
    }

    //추가예정
    // if (12 <= missionCompleteId.length) {
    //   const image =
    //     "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage/grade4.png";
    //   const gradeKeyword = "시크릿 해결사";
    //   await new UserRepository().upGradeUser(image, gradeKeyword, userKey);
    // }

    const Userdata = await new UserRepository().userDeviceToken(userKey);

    console.log("///////////리워드 미들웨어/////////");
    console.log(Userdata);

    //새로 달성한 미션과 유저의 디바이스 토큰이 있는 경우
    if (newCompleteMissionId.length && Userdata.deviceToken) {
      const messageData = {
        title: "고민접기",
        body: "리워드를 확인하세요!",
        link: `reward`,
        date: dayjs().tz().format("YYYY/MM/DD HH:mm:ss"),
      };

      const message = {
        token: Userdata.deviceToken,
        data: messageData,
      };

      const jsonData = JSON.stringify(messageData);
      await redisCli.rPush(`${userKey}_A`, jsonData);

      admin
        .messaging()
        .send(message)
        .catch(function (error) {
          console.trace(error);
        });
    }

    return;
  } catch (error) {
    console.trace(error);
  }
};
