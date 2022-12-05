const MissionRepository = require("../repositories/mission.repository");
const UserRepository = require("../repositories/users.repository");
const CommentRepository = require("../repositories/comment.repository");
class MissionService {
  missionRepository = new MissionRepository();
  userRepository = new UserRepository();
  commentRepository = new CommentRepository();

  //리워드 페이지
  reword = async (userKey) => {
    //유저활동기록 가져오기
    const totalReword = await this.userRepository.totalReword(userKey);
    const Selects = await this.commentRepository.userSelect(userKey);
    const grade = await this.userRepository.grade(userKey);

    /**내가 받은 총 좋아요수 */
    const likeTotal = totalReword.receiveLikeCount;

    /**내 게시글의 총 조회수 */
    let viewCount = 0;
    // const viewCountArray = totalReword.Advice.map((x) => x.viewCount);

    // viewCountArray.forEach((x) => {
    //   viewCount += x;
    // });

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

    const missionComplete = await this.missionRepository.completeMission(
      userKey
    );
    const allMision = await this.missionRepository.findAllMission();

    let result = [];
    for (const mission of allMision) {
      let isComplete = false;
      let isGet = false;
      missionComplete.forEach((complete) => {
        if (complete.missionId == mission.missionId) {
          isComplete = true;
          complete.isGet ? (isGet = true) : (isGet = false);
        }
      });
      if (isGet) {
        result.push({
          mission: mission.missionId,
          isComplete: isComplete,
          isGet: isGet,
          pharse: mission.pharse,
          rewardName: mission.rewardName,
        });
      } else {
        result.push({
          mission: mission.missionId,
          isComplete: isComplete,
          isGet: isGet,
        });
      }
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
        missionComplete: missionComplete.length,
      },
      grade: grade.grade,
    };

    return data;
  };
}

module.exports = MissionService;
