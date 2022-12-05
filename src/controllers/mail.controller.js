const UserService = require("../services/users.service");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

class MailController {
  /* 임시 비밀번호 전달
    1. ID확인,
    2. 닉네임 확인,
    3. 임시비밀번호 전달 */
  userService = new UserService();

  temporaryPassword = async (req, res, next) => {
    const { userId, nickname, email } = req.body;

    try {
      // ID확인, 닉네임 확인
      const findId = await this.userService.findId(userId);

      if (findId.userId == null) {
        res.status(200).json({ mas: "당신 아이디가 아니군요!" });
      }
      if (findId.nickname !== nickname) {
        res.status(200).json({ mas: "당신은 주인이 아니군요." });
      }
      // 랜덤 스트링 생성
      const temporaryPassword = Math.random().toString(36).substring(2, 12);
      console.log(temporaryPassword)

      const hashed = await bcrypt.hash(temporaryPassword, 12);
      console.log(hashed)

      await this.userService.temporaryPassword(userId, hashed);



      // 전송하기
      let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.GOOGLE_MAIL, // 보내는 사람의 메일
          pass: process.env.GOOGLE_PASSWORD, // 보내는 사람의 비밀번호 (또는 생성한 앱 비밀번호)
        },
      });

      // 보낼 메세지
      let message = {
        from: process.env.GOOGLE_MAIL, // 보내는 사람
        to: `${nickname}<${email}>`, // 받는 사람 이름과 이메일 주소
        subject: `${nickname}님 고민접기 임시 비밀번호 입니다.`, // 메일 제목
        html: `<h2>${nickname} 님, 안녕하세요.</h2> <br/> <h2>제목: ${nickname}님 고민접기 임시 비밀번호는 ${temporaryPassword} 입니다.</h2>`,
      };

      // 메일이 보내진 후
      transporter.sendMail(message, (err) => {
        if (err) next(err);
        else res.status(200).json({ message:"임시 비밀번호 생성 완료",  MailSucssess: true });
      });
    } catch (err) {
      next(err);
    }
  };

}

module.exports = MailController;
