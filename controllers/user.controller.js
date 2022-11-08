const UserService = require("../services/users.service");
const joi = require("../util/joi");
const bcrypt = require("bcrypt");
const ErrorCustom = require("../exceptions/error-custom");
require("dotenv").config();
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
      console.log(userId, password);

      const { accessToken, refreshToken } = await this.userService.verifyUser(
        userId,
        password
      );

      //refreshtoken을 userId키로 redis에 저장
      await redisCli.set(userId, refreshToken);

      res.cookie("accesstoken", accessToken);
      res.cookie("refreshtoken", refreshToken);

      return res
        .status(200)
        .json({ accessToken, refreshToken, message: "로그인 성공." });
    } catch (error) {
      next(error);
    }
  };

  //아이디 닉네임 중복검사
  check = async (req, res, next) => {
    try {
      const { nickname, userId } = req.body;

      console.log(nickname, userId);
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
      const data = await this.userService.mainPage(userKey);

      return res.status(200).json({ data: data });
    } catch (error) {
      next(error);
    }
  };

  // // 프로필 수정
  // profileUpdate = async (req, res, next) => {
  //   const { userId } = res.locals.user;
  //   //console.log(userId, "아이디");
  //   const { userKey } = req.params;
  //   //console.log(userKey)
  //   const findUser = await this.usersService.profile(userKey);
  //   //console.log(findUser)
  //   if (userId !== findUser.userId) {
  //     return res.status(400).json({ errorMessage: "권한이 없습니다." });
  //   }
  //   try {
  //     //console.log(req.file);
  //     const image = req.files;
  //     // const { nickname, introduce } = req.body;

  //     //이미지 수정
  //     if (image) {
  //       const findUserImage = findUser.avatar.split("/")[4];
  //       const findUserLastImage = `profileimage/${findUserImage}`;
  //       // console.log(findUserImage, "아아아아");

  //       try {
  //         const s3 = new aws.S3({
  //           accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //           secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //           region: process.env.AWS_REGION,
  //         });

  //         const params = {
  //           Bucket: process.env.AWS_BUCKET_NAME,
  //           Key: findUserLastImage,
  //         };

  //         s3.deleteObject(params, function (err, data) {
  //           if (err) {
  //             console.log(err, err.stack);
  //           } else {
  //             res.status(200);
  //             next();
  //           }
  //         });
  //       } catch (error) {
  //         next(error);
  //       }

  //       const value = Object.values({ image });
  //       const imageUrl = value[0][0].transforms[0].location;
  //       await this.userService.uploadUserImage(imageUrl, userKey);
  //     }

  //     // //닉네임 수정
  //     // if (nickname) {
  //     //   await this.usersService.updateNickname(nickname, userId);
  //     // }

  //     // //소개글 수정
  //     // if (introduce) {
  //     //   await this.usersService.updateIntroduce(introduce, userId);
  //     // }

  //     // if (!image && !nickname && !introduce) {
  //     //   res.status(200).json({ msg: "변경할 내용이 없습니다" });
  //     // }
  //     res.status(200).json({ msg: "프로필 수정 완료!" });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

module.exports = UserController;
