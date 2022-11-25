const UserService = require("../services/users.service");
const joi = require("../util/joi");
const bcrypt = require("bcrypt");
const ErrorCustom = require("../exceptions/error-custom");

require("dotenv").config();

const aws = require("aws-sdk");

const redisCli = require("../util/redis");

class UserController {
  userService = new UserService();

  /**회원가입 컨트롤러 */
  signup = async (req, res, next) => {
    try {
      const { userId, nickname, password, confirm, isAdult } =
        await joi.signupSchema.validateAsync(req.body);

      const hashed = await bcrypt.hash(password, 12);

      await this.userService.createUser({
        userId: userId,
        nickname: nickname,
        password: hashed,
        isAdult: isAdult,
      });
      res.status(200).json({ message: "회원가입 성공" });
    } catch (error) {
      next(error);
    }
  };

  /**로그인 컨트롤러 */
  login = async (req, res, next) => {
    try {
      // const { email, password } = await joi.loginSchema.validateAsync(req.body);
      const { userId, password } = req.body;

      const { accessToken, refreshToken, nickname } =
        await this.userService.verifyUser(userId, password);

      //refreshtoken을 userId키로 redis에 저장
      await redisCli.set(userId, refreshToken);

      res.cookie("accesstoken", accessToken);
      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
      });

      return res
        .status(200)
        .json({ accessToken, refreshToken, message: "로그인 성공.", nickname });
    } catch (error) {
      next(error);
    }
  };

  //아이디 닉네임 중복검사
  check = async (req, res, next) => {
    try {
      const { nickname, userId } = req.body;

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

  //메인페이지 가져오기
  mainPage = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const mainpage = await this.userService.mainPage(userKey);

      const { dailyData } = await this.userService.getDailymessage(userKey);

      return res
        .status(200)
        .json({ mainpage: mainpage, dailyMessage: dailyData.msg });
    } catch (error) {
      next(error);
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
        return res
          .status(200)
          .json({ message: "오늘 처음 메세지를 열었습니다!" });
      }

      return res.status(401).json({ message: "잘못된 요청입니다" });
    } catch (error) {
      next(error);
    }
  };

  //마이페이지 조회
  mypage = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;

      const mypage = await this.userService.mypage(userKey);

      return res.status(200).json(mypage);
    } catch (error) {
      next(error);
    }
  };

  //검색 조회
  search = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      // const { keyword } = req.body;
      const { keyword } = req.params;
      const result = await this.userService.search(userKey, keyword);

      return res.status(200).json(result);
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
      const mission = await this.userService.reword(userKey);

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

  // 프로필 수정
  profileUpdate = async (req, res, next) => {
    const { userKey } = res.locals.user;
    if (userKey == 0) {
      return res.status(400).send({ message: "로그인이 필요합니다." });
    }
    const image = req.file;
    const { nickname } = req.body;

    const findUser = await this.userService.findUserImage(userKey);
    const findUserImage = findUser.userImage;

    try {
      //이미지 수정
      if (image) {
        for (let i = 0; i < findUserImage.length; i++) {
          const s3 = new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION,
          });

          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: findUserImage[i],
          };

          s3.deleteObject(params, function (err, data) {});
        }

        const imageUrl = image.location;
        await this.userService.uploadUserImage(imageUrl, userKey);
      }

      if (nickname) {
        await this.userService.updateUserNickname(userKey, nickname);
      }

      if (!image && !nickname) {
        return res.status(200).json({ msg: "변경할 내용이 없습니다" });
      }

      res.status(200).json({ msg: "프로필 수정 완료!" });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
