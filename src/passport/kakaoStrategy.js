require("dotenv").config();
const passport = require("passport");
const KaKaoStrategy = require("passport-kakao").Strategy;
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new KaKaoStrategy(
      {
        clientID: process.env.CLIENT_ID,
        callbackURL: process.env.CALLBACK_URL,
      },
      // clientID에 카카오 앱 아이디 추가
      // callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL

      // accessToken, refreshToken : 로그인 성공 후 카카오가 보내준 토큰
      // profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(accessToken);
          console.log(refreshToken);
          const userImg = profile._json.properties.profile_image;
          const email = profile._json.kakao_account.email;
          const ageRange = profile._json.kakao_account.age_range;
          let age;
          20 <= Number(ageRange.substr(0, 2)) ? (age = true) : (age = false);
          const exUser = await User.findOne({
            where: { userId: email },
          });

          if (exUser) {
            await User.update(
              { userImg: userImg },
              { where: { userId: email } }
            );
            done(null, exUser);
            console.log(exUser, "카카오 로그인 성공!");
          } else {
            const newUser = await User.create({
              userId: email,
              nickname: profile.username,
              userImg: userImg,
              isAdult: age,
            });
            done(null, newUser);
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
