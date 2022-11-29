const MissionRepository = require("../repositories/mission.repository");
const UserRepository = require("../repositories/users.repository");

class MissionService {
  missionRepository = new MissionRepository();
  userRepository = new UserRepository();

  reword = async (userKey) => {
    /**유저의 활동 정보를 모두 가져옴 */
    const totalReword = await this.userRepository.totalReword(userKey);

    const likeArray = totalReword.Comments.map((x) => x.CommentLikes.length);
    /**내가 받은 총 좋아요수 */
    let likeTotal = 0;
    likeArray.forEach((x) => {
      likeTotal += x;
    });

    const viewCountArray = totalReword.Advice.map((x) => x.viewCount);

    /**내 게시글의 총 조회수 */
    let viewCount = 0;

    viewCountArray.forEach((x) => {
      viewCount += x;
    });

    /** 내가 조언해준 횟수*/
    const totalAdviceComment = totalReword.Comments.length;

    /**내가 투표한횟수 */
    const totalChoicePick = totalReword.isChoices.length;

    /**내가 쓴 조언게시글 수 */
    const totalAdvice = totalReword.Advice.length;

    /**투표 게시글 작성 수 */
    const totalChoice = totalReword.Choices.length;

    /**마감된 투표 게시글 수 */
    const totalEndChoice = totalReword.Choices.filter(
      (choice) => choice.isEnd == true
    ).length;

    /**총게시글 작성 수 */
    const totalPost = totalAdvice + totalChoice;

    /**행운의 편지 열기 횟수 */
    const totalOpen = totalReword.msgOpenCount;

    /**채택받은 횟수 */
    const totalSelected = totalReword.CommentSelects.length;

    /**채택한 횟수 */
    const totalSelect = totalReword.Comments.filter(
      (x) => x.CommentSelects.length
    ).length;

    /**고민 마감 횟수 */
    const totalSolution = totalSelect + totalEndChoice;
    console.log(
      `totalAdviceComment:${totalAdviceComment}, 
      totalChoicePick:${totalChoicePick}, 
      totalAdvice:${totalAdvice},
      totalChoice${totalChoice},
      totalPost${totalPost},
      viewCount:${viewCount},
      likeTotal:${likeTotal},
      totalOpen:${totalOpen},
      totalSelected:${totalSelected},
      totalSolution${totalSolution}`
    );
    /**모든 미션Id */
    const missionarray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    /**완료한 미션 */
    const completedMission = await this.missionRepository.completeMission(
      userKey
    );

    /**완료한 미션 ID */
    const CompleteMission = completedMission.map((x) => x.missionId);

    /**미완료 미션ID */
    const unCompleteMission = missionarray.filter(
      (x) => !CompleteMission.includes(x)
    );

    console.log(unCompleteMission);
    console.log(CompleteMission);

    /**미완료 미션을 가져와 기준에 충족하면 newCompleteMissonId 배열에 추가*/
    const mission = await this.missionRepository.mission(unCompleteMission);

    /**새로 완료한 미션이 담긴 배열 */
    const newCompleteMissionId = [];
    mission.forEach((mission) => {
      if (mission.missionId == 1) {
        mission.PostMission.postMission <= totalAdvice
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (
        mission.missionId == 2 ||
        mission.missionId == 3 ||
        mission.missionId == 4
      ) {
        mission.ChoiceMission.choiceMission <= totalChoicePick &&
        mission.AdviceMission.adviceMission <= totalAdviceComment
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 5 || mission.missionId == 11) {
        mission.LikeMission.likeMission <= likeTotal
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 6) {
        mission.PostMission.postMission <= totalAdvice &&
        mission.ChoiceMission.choiceMission <= totalChoicePick &&
        mission.LikeMission.likeMission <= likeTotal
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 7) {
        mission.MsgMission.msgMission <= totalOpen
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 8 || mission.missionId == 10) {
        mission.SelectMission.selectMission <= totalSelected
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 9) {
        mission.SolutionMission.solutionMission <= totalSolution
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
      if (mission.missionId == 12) {
        mission.MissionCompleteMission.completeMission <= CompleteMission.length
          ? newCompleteMissionId.push(mission.missionId)
          : false;
      }
    });

    for (const missionId of newCompleteMissionId) {
      await this.missionRepository.createCompleteMission(userKey, missionId);
    }

    const missionComplete = await this.missionRepository.completeMission(
      userKey
    );
    const missionCompleteId = missionComplete.map((x) => {
      return [x.missionId, x.isGet];
    });
    console.log(missionCompleteId);

    let result = [];
    for (let i = 1; i < 10; i++) {
      let isComplete = false;
      let isGet = false;
      missionCompleteId.forEach((x) => {
        if (x[0] == i) {
          isComplete = true;
        }
        if (x[0] == i && x[1] == 1) {
          isGet = true;
        }
      });

      result.push({
        mission: i,
        isComplete: isComplete,
        isGet: isGet,
      });
    }
    const data = {
      result: result,
      missionCount: {
        totalAdviceComment: totalAdviceComment,
        totalChoicePick: totalChoicePick,
        totalAdvice: totalAdvice,
        totalChoice: totalChoice,
        totalPost: totalPost,
        viewCount: viewCount,
        likeTotal: likeTotal,
        msgOpen: totalOpen,
        Selected: totalSelected,
        totalSolution: totalSolution,
        missionComplete: CompleteMission.length + newCompleteMissionId.length,
      },
    };

    return data;
  };

  NewComplete = async (userKey) => {
    const totalReword = await this.userRepository.totalReword(userKey);

    const likeArray = totalReword[0].Comments.map((x) => x.CommentLikes.length);
    /**내가 받은 총 좋아요수 */
    let likeTotal = 0;
    likeArray.forEach((x) => {
      likeTotal += x;
    });

    const viewCountArray = totalReword[0].Advice.map((x) => x.viewCount);

    /**내 게시글의 총 조회수 */
    let viewCount = 0;

    viewCountArray.forEach((x) => {
      viewCount += x;
    });

    /** 내가 조언해준 횟수*/
    const totalAdviceComment = totalReword[0].Comments.length;

    /**내가 투표한횟수 */
    const totalChoicePick = totalReword[0].isChoices.length;

    /**내가 쓴 조언게시글 수 */
    const totalAdvice = totalReword[0].Advice.length;

    /**투표 게시글 작성 수 */
    const totalChoice = totalReword[0].Choices.length;

    /**총게시글 작성 수 */
    const totalPost = totalAdvice + totalChoice;

    /**행운의 편지 열기 횟수 */
    const totalOpen = totalReword[0].msgOpenCount;

    console.log(
      `totalAdviceComment:${totalAdviceComment}, 
      totalChoicePick:${totalChoicePick}, 
      totalAdvice:${totalAdvice},
      totalChoice${totalChoice},
      totalPost${totalPost},
      viewCount:${viewCount},
      likeTotal:${likeTotal},
      totalOpen:${totalOpen}`
    );
    /**모든 미션Id */
    const missionarray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    /**완료한 미션 */
    const completedMission = await this.missionRepository.completeMission(
      userKey
    );

    /**완료한 미션 ID */
    const CompleteMission = completedMission.map((x) => x.missionId);

    /**미완료 미션ID */
    const unCompleteMission = missionarray.filter(
      (x) => !CompleteMission.includes(x)
    );

    console.log(unCompleteMission);
    console.log(CompleteMission);

    /**미완료 미션을 가져와 기준에 충족하면 newCompleteMissonId 배열에 추가*/
    const mission = await this.missionRepository.mission(unCompleteMission);

    /**새로 완료한 미션이 담긴 배열 */
    const newCompleteMissionId = [];
    mission.forEach((x) => {
      x.missionId;
      if (x.AdviceMission) {
        x.AdviceMission.adviceMission <= totalAdviceComment
          ? newCompleteMissionId.push(x.missionId)
          : false;
      }
      if (x.ChoiceMission) {
        x.ChoiceMission.choiceMission <= totalChoicePick
          ? newCompleteMissionId.push(x.missionId)
          : false;
      }
      if (x.PostMission) {
        x.PostMission.postMission <= totalAdvice
          ? newCompleteMissionId.push(x.missionId)
          : false;
      }
      if (x.LikeMission) {
        x.LikeMission.likeMission <= likeTotal
          ? newCompleteMissionId.push(x.missionId)
          : false;
      }
    });

    return newCompleteMissionId;
  };
}

module.exports = MissionService;
