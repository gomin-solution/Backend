const UserService = require("../services/users.service");
const AdviceService = require("../services/advice.service");
const ChoiceService = require("../services/choice.service");
const MissionService = require("../services/mission.service");
const ManagerService = require("../services/manager.service");
const joi = require("../util/joi");
const bcrypt = require("bcrypt");
const ErrorCustom = require("../exceptions/error-custom");
const cookie = require("cookie");

require("dotenv").config();

const aws = require("aws-sdk");

const redisCli = require("../util/redis");

class UserController {
  userService = new UserService();
  adviceService = new AdviceService();
  choiceService = new ChoiceService();
  missionService = new MissionService();
  managerService = new ManagerService();

  /**회원가입 컨트롤러 */
  signup = async (req, res, next) => {
    try {
      const { userId, nickname, password, confirm, isAdult } =
        await joi.signupSchema.validateAsync(req.body);

      const hashed = await bcrypt.hash(password, 12);

      const { accessToken, refreshToken, userKey } =
        await this.userService.createUser({
          userId: userId,
          nickname: nickname,
          password: hashed,
          isAdult: isAdult,
        });

      await redisCli.set(userId, refreshToken, { EX: 60 * 60 * 24 * 15 });

      res
        .status(200)
        .json({ message: "회원가입 성공", accessToken, refreshToken, userKey });
    } catch (error) {
      next(error);
    }
  };

  /**로그인 컨트롤러 */
  login = async (req, res, next) => {
    try {
      const { userId, password } = req.body;
      const { accessToken, refreshToken, nickname, userKey } =
        await this.userService.verifyUser(userId, password);

      //refreshtoken을 userId키로 redis에 저장
      await redisCli.set(userId, refreshToken, { EX: 60 * 60 * 24 * 15 });
      //배포환경인 경우 보안 설정된 쿠키 전송

      res.status(200).json({
        message: "로그인 성공.",
        nickname,
        userKey,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  kakao = async (req, res, next) => {
    try {
      const { id } = req.body;

      console.log(id);
      const { accessToken, refreshToken, created, data } =
        await this.userService.userKakao(id);

      if (created || !data.nickname) {
        return res.status(201).json({
          message: "신규가입.",
          isMember: false,
          userKey: data.userKey,
        });
      } else {
        //refreshtoken을 userId키로 redis에 저장
        await redisCli.set(id, refreshToken, { EX: 60 * 60 * 24 * 15 });
        console.log("//////////카카오 로그인");
        console.log("유저키", data.userKey);

        return res.status(200).json({
          message: "카카오 로그인 성공.",
          isMember: true,
          nickname: data.nickname,
          userKey: data.userKey,
          accessToken,
          refreshToken,
        });
      }
    } catch (error) {
      next(error);
    }
  };

  //아이디 닉네임 중복검사
  check = async (req, res, next) => {
    try {
      const { nickname, userId } = await joi.checkSchema.validateAsync(
        req.body
      );

      if (!nickname && !userId) {
        return res.status(400).json({ message: "잘못된 요청입니다" });
      }

      //닉네임 중복 검사
      if (nickname) {
        await this.userService.findNickname(nickname);
        return res.status(200).json({ message: "사용 가능한 닉네임 입니다" });
      }

      //아이디 중복 검사
      if (userId) {
        await this.userService.findUserId(userId);
        return res.status(200).json({ message: "사용 가능한 아이디 입니다" });
      }
    } catch (error) {
      next(error);
    }
  };

  //비밀번호 변경
  passwordChange = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { newPassword, password } = await joi.passwordSchema.validateAsync(
        req.body
      );

      const hashed = await bcrypt.hash(newPassword, 12);

      await this.userService.passwordChange(userKey, hashed, password);

      return res.status(200).json({ message: "비밀번호 변경 완료" });
    } catch (error) {
      next(error);
    }
  };

  //닉네임 변경
  nicknameChange = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;

      const { nickname } = await joi.nicknameSchema.validateAsync(req.body);

      await this.userService.nicknameChange(userKey, nickname);

      return res.status(200).json({ message: "닉네임 변경 완료" });
    } catch (error) {
      next(error);
    }
  };

  kakaoNickname = async (req, res, next) => {
    try {
      const { userKey, nickname } = req.body;
      if (!userKey || !nickname) {
        res.status(400).json({ erroMessage: "잘못된 요청입니다" });
      }
      await this.userService.nicknameChange(userKey, nickname);

      const { accessToken, refreshToken } = await this.userService.Kakaotoken(
        userKey
      );

      return res.status(200).json({ accessToken, refreshToken, userKey });
    } catch (error) {
      next(error);
    }
  };
  //메인페이지 가져오기
  mainPage = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const mainpage = await this.userService.mainPage(userKey);

      const { dailyData } = await this.userService.getDailymessage(userKey);

      return res
        .status(200)
        .json({ mainpage: mainpage, dailyMessage: dailyData?.msg });
    } catch (error) {
      next(error);
    }
  };

  /**내가쓴 글 가져오기 */
  myPost = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const myadvice = await this.adviceService.myadvice(userKey);
      const mychoice = await this.choiceService.findMychoice(userKey);
      return res.status(200).json({ mychoice: mychoice, myadvice: myadvice });
    } catch (err) {
      next(err);
    }
  };

  //행운메세지 open 업데이트
  dailyMessage = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(401).json({ message: "로그인이 필요한 기능입니다." });
      }
      const { isOpen } = await this.userService.getDailymessage(userKey);
      if (!isOpen) {
        await this.userService.updateMessageOpen(userKey);
        next(userKey);
        return res
          .status(200)
          .json({ message: "오늘 처음 메세지를 열었습니다!" });
      }
      return res.status(401).json({ message: "잘못된 요청입니다" });
    } catch (error) {
      next(error);
    }
  };

  //설정페이지 조회
  setting = async (req, res, next) => {
    try {
      const { userKey, level } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      if (!level) {
        const mypage = await this.userService.mypage(userKey);
        return res.status(200).json({ mypage: mypage, admin: false });
      } else {
        const allReport = await this.managerService.allReport();
        return res.status(200).json({ allReport: allReport, admin: true });
      }
    } catch (error) {
      next(error);
    }
  };

  //검색 조회
  search = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { keyword } = req.params;
      const result = await this.userService.search(userKey, keyword);

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  searchPage = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;

      const searchPage = await this.userService.searchPage(userKey);

      return res.status(200).json(searchPage);
    } catch (error) {
      next(error);
    }
  };

  //리워드 페이지
  reword = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const mission = await this.missionService.reword(userKey);

      return res.status(200).json(mission);
    } catch (error) {
      next(error);
    }
  };

  //리워드 휙득요청
  getReword = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { missionId } = req.params;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      const isComplete = await this.userService.isComplete(userKey, missionId);
      if (!isComplete) {
        return res.status(400).json({ message: "미션을 완료해 주세요" });
      }

      const [isGet] = await this.userService.getReword(userKey, missionId);

      if (isGet) {
        return res.status(200).json({ message: "리워드 휙득완료!" });
      } else {
        return res.status(400).json({ message: "이미 휙득 했습니다" });
      }
    } catch (error) {
      next(error);
    }
  };

  //회원탈퇴
  bye = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      await this.userService.bye(userKey);

      return res.status(200).json({ message: "다음에 또 봐요" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;
