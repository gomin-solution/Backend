const ErrorCustom = require("../exceptions/error-custom");
const UserRepository = require("../repositories/users.repository.js");
const AdviceRepository = require("../repositories/advice.repository");
const ChoiceRepository = require("../repositories/choice.repository");
const MissionService = require("../services/mission.service");
const MissionRepository = require("../repositories/mission.repository");
const DailyMsgRepository = require("../repositories/dailymessage.repository");
const CommentRepository = require("../repositories/comment.repository");

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
  missionService = new MissionService();
  commentRepository = new CommentRepository();

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

    const accessToken = jwt.sign(
      { userId: userId, userKey: createUser.userKey },
      process.env.SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });
    return { accessToken, refreshToken, userKey: createUser.userKey };
  };

  userKakao = async (id) => {
    const { data, created } = await this.userRepository.userKakao(id);
    if (created) {
      const DailyArray = await this.dailyMsgRepository.allMsg();
      const msgArray = DailyArray.map((x) => x.msg);
      const msg = msgArray[Math.floor(Math.random() * msgArray.length)];
      await redisCli.hSet(`${data.userKey}`, {
        msg: msg,
        isOpen: 0,
      });
    }

    const accessToken = jwt.sign(
      { userId: id, userKey: data.userKey },
      process.env.SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    return { accessToken, refreshToken, created, data };
  };

  Kakaotoken = async (userKey) => {
    const findUserId = await this.userRepository.findUserKey(userKey);

    const accessToken = jwt.sign(
      { userId: findUserId.userId, userKey: userKey },
      process.env.SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    return { accessToken, refreshToken };
  };

  //유저 검증
  verifyUser = async (userId, password) => {
    const user = await this.userRepository.findUserId(userId);
    if (!user) throw new ErrorCustom(400, "가입되지 않은 아이디 입니다");

    const passwordVerify = await bcrypt.compare(password, user.password);

    if (!passwordVerify) throw new ErrorCustom(400, "비밀번호 오류");

    const accessToken = jwt.sign(
      { userId: user.userId, userKey: user.userKey },
      process.env.SECRET_KEY,
      {
        expiresIn: "30m",
      }
    );

    const refreshToken = jwt.sign({}, process.env.SECRET_KEY, {
      expiresIn: "15d",
    });

    const nickname = user.nickname;
    const userKey = user.userKey;
    return { accessToken, refreshToken, nickname, userKey };
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

  //아이디 찾기
  findId = async (userId) => {
    const findUserId = await this.userRepository.findUserId(userId);
    return findUserId;
  };

  //비밀번호 변경
  passwordChange = async (userKey, hashed, password) => {
    const user = await this.userRepository.findUserKey(userKey);
    if (!user.password)
      throw new ErrorCustom(400, "비밀번호를 변경할 수 없습니다.");

    const passwordVerify = await bcrypt.compare(password, user.password);
    if (!passwordVerify) throw new ErrorCustom(400, "비밀번호 오류");

    await this.userRepository.passwordChange(userKey, hashed);
    return;
  };

  //임시 비밀번호 생성
  temporaryPassword = async (userId, hashed) => {
    const findUserId = await this.userRepository.findUserId(userId);

    await this.userRepository.temporaryPassword(userId, hashed);
  };

  //닉네임 변경
  nicknameChange = async (userKey, nickname) => {
    const existNickname = await this.userRepository.findNickname(nickname);
    if (existNickname) {
      throw new ErrorCustom(400, "중복된 닉네임 입니다");
    }
    await this.userRepository.nicknameChange(userKey, nickname);
    return;
  };

  //메인페이지 데이터 가공해서 보내주기
  mainPage = async (userKey) => {
    const getAdvice = await this.adviceRepository.getAdvice();
    const dailyData = await redisCli.hGetAll(`${userKey}`);
    const select = await this.commentRepository.findAllSelect();
    let isOpen;
    dailyData?.isOpen == "0" || userKey == 0
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
    const getChoice = await this.choiceRepository.findAllChoiceForMain(userKey);

    const isEnd = getChoice.filter((post) => post.isEnd == true);

    const totalCount = select.length + isEnd.length;

    return {
      advice: lowAdviceData[Math.floor(Math.random() * lowAdviceData.length)],
      totalCount: totalCount,
      isOpen: isOpen,
    };
  };

  getDailymessage = async (userKey) => {
    const dailyData = await redisCli.hGetAll(`${userKey}`);
    let isOpen;
    dailyData?.isOpen == "0" || !dailyData ? (isOpen = false) : (isOpen = true);
    return { isOpen, dailyData };
  };

  updateMessageOpen = async (userKey) => {
    await redisCli.hSet(`${userKey}`, {
      isOpen: 1,
    });
    await this.missionRepository.messageOpenActivity(userKey);
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
      };
    }
    const user = await this.userRepository.findUser(userKey);
    let isKakao;
    isNaN(Number(user.userId)) ? (isKakao = false) : (isKakao = true);

    const result = {
      nickname: user.nickname,
      userImage: user.userImg,
      grade: user.grade,
      isKakao: isKakao,
    };

    return result;
  };

  findUserImage = async (userKey) => {
    const user = await this.userRepository.findUserKey(userKey);
    const userImage = ["profileimage/" + user.userImg];
    const userResizeImage = ["profileimage-resize/" + user.userImg];
    const totalUserImage = userImage.concat(userResizeImage);
    console.log(totalUserImage);
    const result = {
      userImage: totalUserImage,
    };
    return result;
  };

  //검색 페이지
  searchPage = async (userKey) => {
    const user = await this.userRepository.findUser(userKey);
    const advice = await this.adviceRepository.findHot3();

    const advicehot3 = advice.map((advice) => {
      return {
        adviceId: advice.adviceId,
        category: advice.Category.name,
        title: advice.title,
      };
    });

    return { nickname: user?.nickname, advice: advicehot3 };
  };

  //검색 가져오기
  search = async (userKey, keyword) => {
    const getChoice = await this.choiceRepository.choiceSeach(userKey, keyword);

    const choiceData = getChoice.map((post) => {
      let boolean;
      let isChoice;
      post.isChoices.length ? (isChoice = true) : (isChoice = false);
      post.ChoiceBMs.length ? (boolean = true) : (boolean = false);
      return {
        choiceId: post.choiceId,
        title: post.title,
        choice1Name: post.choice1Name,
        choice2Name: post.choice2Name,
        choice1: post.choice1Per,
        choice2: post.choice2Per,
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

  bye = async (userKey) => {
    return await this.userRepository.bye(userKey);
  };
}

module.exports = UserService;
