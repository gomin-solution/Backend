module.exports = async (data, req, res, next) => {
  /**유저의 활동 정보를 모두 가져옴 */
  //   const totalReword = await this.userRepository.totalReword(userKey);
  console.log("///////////////req///////////////");
  console.log(req);
  console.log("////////////////res/////////////");
  console.log(res);
  console.log("/////////////userKey//////////");
  console.log(data.userKey);
  console.log(data.title);

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
  /**모든 미션Id */
  const missionarray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

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

  /**미완료 미션을 가져와 기준에 충족하면 newCompleteMissonId 배열에 추가*/
  const mission = await this.missionRepository.mission(unCompleteMission);

  /**새로 완료한 미션이 담긴 배열 */
  const newCompleteMissionId = [];
  mission.forEach((mission) => {
    console.log(mission);
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
      mission.MissionCompleteMission?.completeMission <= CompleteMission.length;

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
    if (mission.missionId == 5 || mission.missionId == 11) {
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
    if (mission.missionId == 12) {
      MissionComplete ? newCompleteMissionId.push(mission.missionId) : false;
    }
  });

  for (const missionId of newCompleteMissionId) {
    await this.missionRepository.createCompleteMission(userKey, missionId);
  }

  //   if (newCompleteMissionId) {
  //     io.to(userKey).emit("missionAlarm", "미션을 완료했습니다");
  //   }
};