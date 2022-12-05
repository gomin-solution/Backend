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
    console.log("userKey", userKey);
    const totalReword = await this.userRepository.totalReword(userKey);
    const Selects = await this.commentRepository.userSelect(userKey);

    console.log(totalReword);
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

    const missionCompleteId = await this.missionRepository.completeMission(
      userKey
    );

    let result = [];
    for (let i = 1; i < 13; i++) {
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
        missionComplete: missionCompleteId.length,
      },
    };

    return data;
  };
}

module.exports = MissionService;
