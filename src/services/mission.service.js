const MissionRepository = require("../repositories/mission.repository");
const UserRepository = require("../repositories/users.repository");

class MissionService {
  missionRepository = new MissionRepository();
  userRepository = new UserRepository();

  //리워드 페이지
  reword = async (userKey) => {
    /**유저의 활동 정보를 모두 가져옴 */
    const totalReword = await this.userRepository.totalReword(userKey);

    const likeArray = totalReword.Comments.map((x) => x.CommentLikes.length);
    /**내가 받은 총 좋아요수 */
    let likeTotal = 0;
    likeArray.forEach((x) => {
      likeTotal += x;
    });

    /**내 게시글의 총 조회수 */
    let viewCount = 0;
    // const viewCountArray = totalReword.Advice.map((x) => x.viewCount);

    // viewCountArray.forEach((x) => {
    //   viewCount += x;
    // });

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

    // totalAdviceComment: 댓글작성 횟수,
    // totalChoicePick: 투표 횟수,
    // totalAdvice: 답해주기글 횟수,
    // totalChoice: 골라주기글 횟수,
    // totalPost: 총 작성게시글 수,
    // viewCount: 총 게시글 조회수,
    // likeTotal: 좋아요 받은 갯수,
    // msgOpen: 메세지 오픈 횟수,
    // Selected: 채택받은 횟수,
    // totalSolution: 마감한 게시글수(채택마감+선택마감),
    // missionComplete: 미션 완료 수

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

    ////////////////여기부분 까지////////////
    const missionComplete = await this.missionRepository.completeMission(
      userKey
    );
    const missionCompleteId = missionComplete.map((x) => {
      return [x.missionId, x.isGet];
    });

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
        missionComplete: missionComplete.length,
      },
    };

    return data;
  };
}

module.exports = MissionService;
