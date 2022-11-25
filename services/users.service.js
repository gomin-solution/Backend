const ErrorCustom = require("../exceptions/error-custom");
const UserRepository = require("../repositories/users.repository.js");
const AdviceRepository = require("../repositories/advice.repository");
const ChoiceRepository = require("../repositories/choice.repository");
const MissionRepository = require("../repositories/mission.repository");
const DailyMsgRepository = require("../repositories/dailymessage.repository");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const redisCli = require("../util/redis");
require("dotenv").config();

class UserService {
  userRepository = new UserRepository();
  adviceRepository = new AdviceRepository();
  choiceRepository = new ChoiceRepository();
  missionRepository = new MissionRepository();
  dailyMsgRepository = new DailyMsgRepository();

  //유저 생성(가입)
  createUser = async ({
    userId: userId,
    nickname: nickname,
    password: hashed,
    isAdult: isAdult,
  }) => {
    isAdult == "true" ? (isAdult = true) : (isAdult = false);
    const createUser = await this.userRepository.createUser({
      userId: userId,
      nickname: nickname,
      password: hashed,
      isAdult: isAdult,
    });
    //오늘의 랜덤 메세지 유저키와 함께 생성
    const DailyArray = await this.dailyMsgRepository.allMsg();
    const msgArray = DailyArray.map((x) => x.msg);
    const msg = msgArray[Math.floor(Math.random() * msgArray.length)];
    await redisCli.hSet(`${createUser.userKey}`, {
      msg: msg,
      isOpen: 0,
    });
    return;
  };

  //유저 검증
  verifyUser = async (userId, password) => {
    const user = await this.userRepository.findUserId(userId);
    if (!user) throw new ErrorCustom(400, "가입되지 않은 아이디 입니다");

    const passwordVerify = await bcrypt.compare(password, user.password);

    if (!passwordVerify) throw new ErrorCustom(400, "비밀번호 오류");
    const accessToken = jwt.sign(
      { userId: user.userId, userKey: user.userKey },
      process.env.SECRET_KEY
      // {
      //   expiresIn: "5h",
      // }
    );

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    const nickname = user.nickname;
    return { accessToken, refreshToken, nickname };
  };

  //닉네임 중복검사
  findNickname = async (nickname) => {
    const findNickname = await this.userRepository.findNickname(nickname);
    if (findNickname)
      throw new ErrorCustom(400, "이미 존재하는 닉네임 입니다.");
    return;
  };

  //아이디 중복검사
  findUserId = async (userId) => {
    const findUserId = await this.userRepository.findUserId(userId);
    if (findUserId) throw new ErrorCustom(400, "이미 존재하는 아이디 입니다.");
    return;
  };

  //메인페이지 데이터 가공해서 보내주기
  mainPage = async (userKey) => {
    const getAdvice = await this.adviceRepository.getAdvice();
    const dailyData = await redisCli.hGetAll(`${userKey}`);
    let isOpen;
    dailyData.isOpen == "0" || userKey == 0
      ? (isOpen = false)
      : (isOpen = true);
    const adviceData = getAdvice.map((post) => {
      return {
        adviceId: post.adviceId,
        category: post.Category.name,
        title: post.title,
      };
    });
    adviceData.sort((a, b) => a.commentCount - b.commentCount);
    const lowAdviceData = adviceData.slice(0, 10);
    const getChoice = await this.choiceRepository.findUserChoice(userKey);
    const totalCount = getAdvice.length + getChoice.length;

    return {
      advice: lowAdviceData[Math.floor(Math.random() * lowAdviceData.length)],
      totalCount: totalCount,
      isOpen: isOpen,
    };
  };

  getDailymessage = async (userKey) => {
    const dailyData = await redisCli.hGetAll(`${userKey}`);
    let isOpen;
    dailyData.isOpen == "0" ? (isOpen = false) : (isOpen = true);
    return { isOpen, dailyData };
  };

  updateMessageOpen = async (userKey) => {
    await redisCli.hSet(`${userKey}`, {
      isOpen: 1,
    });
    await this.userRepository.messageCountUp(userKey);
  };

  //마이페이지 데이터 가져오기
  mypage = async (userKey) => {
    /**익명 유저인경우 기본 데이터 전송 */
    if (userKey == 0) {
      return {
        userKey: userKey,
        nickname: "로그인이 필요합니다.",
        userImage:
          "https://imgfiles-cdn.plaync.com/file/LoveBeat/download/20200204052053-LbBHjntyUkg2jL3XC3JN0-v4",
        totalAdviceComment: 0,
        totalChoicePick: 0,
      };
    }
    const user = await this.userRepository.findUser(userKey);

    const userImage = [
      "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage/" +
        user.userImg,
    ];
    const userResizeImage = [
      "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage-resize/" +
        user.userImg,
    ];

    const totalUserImage = userImage.concat(userResizeImage);
    console.log(totalUserImage);

    const result = {
      userKey: userKey,
      nickname: user.nickname,
      userImage: totalUserImage,
      totalAdviceComment: user.Comments.length,
      totalChoicePick: user.isChoices.length,
    };

    return result;
  };

  findUserImage = async (userKey) => {
    const user = await this.userRepository.findUserImage(userKey);
    const userImage = ["profileimage/" + user.userImg];
    const userResizeImage = ["profileimage-resize/" + user.userImg];
    const totalUserImage = userImage.concat(userResizeImage);
    console.log(totalUserImage);
    const result = {
      userImage: totalUserImage,
    };
    return result;
  };

  //검색 가져오기
  search = async (userKey, keyword) => {
    const getChoice = await this.choiceRepository.choiceSeach(userKey, keyword);

    const choiceData = getChoice.map((post) => {
      let boolean;
      let isChoice;
      let absolute_a = post.choice1Per;
      let absolute_b = post.choice2Per;
      let choice1Per;
      let choice2Per;
      if (absolute_a + absolute_b > 0) {
        choice1Per = Math.round((absolute_a / (absolute_a + absolute_b)) * 100);
        choice2Per = 100 - choice1Per;
      }
      post.isChoices.length ? (isChoice = true) : (isChoice = false);
      post.ChoiceBMs.length ? (boolean = true) : (boolean = false);
      return {
        choiceId: post.choiceId,
        title: post.title,
        choice1Name: post.choice1Name,
        choice2Name: post.choice2Name,
        choice1Per: choice1Per,
        choice2Per: choice2Per,
        userImage: post.User.userImg,
        nickname: post.User.nickname,
        createdAt: post.createdAt,
        endTime: post.endTime,
        choiceCount: post.choiceCount,
        isBookMark: boolean,
        isChoice: isChoice,
        userKey: post.userKey,
      };
    });

    const getAdvice = await this.adviceRepository.adviceSearch(keyword);

    const adviceData = getAdvice.map((post) => {
      return {
        adviceId: post.adviceId,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        viewCount: post.viewCount,
        commentCount: post.Comments.length,
        userKey: post.userKey,
        category: post.Category.name,
      };
    });

    return { choice: choiceData, advice: adviceData };
  };

  uploadUserImage = async (imageUrl, userKey) => {
    const foundData = await this.userRepository.findUser(userKey);
    if (!foundData) throw new ErrorCustom(400, "사용자가 존재하지 않습니다.");
    const findUserImage = imageUrl.split("/")[4];

    const uploadImagesData = await this.userRepository.uploadUserImage(
      findUserImage,
      userKey
    );
    return uploadImagesData;
  };

  reword = async (userKey) => {
    /**유저의 활동 정보를 모두 가져옴 */
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
      },
    };

    return data;
  };

  getReword = async (userKey, missionId) => {
    const isGet = await this.missionRepository.getReword(userKey, missionId);
    return isGet;
  };

  isComplete = async (userKey, missionId) => {
    const getComplete = await this.missionRepository.isComplete(
      userKey,
      missionId
    );
    return getComplete;
  };
  updateUserNickname = async (userKey, nickname) => {
    const findUser = await this.userRepository.findUser(userKey);
    if (!findUser) throw new ErrorCustom(400, "사용자가 존재하지 않습니다.");
    await this.userRepository.updateUserNickname(userKey, nickname);
  };
}

module.exports = UserService;
