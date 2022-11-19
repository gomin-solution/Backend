const ManagerService = require("../services/manager.service");

class ManagerController {
  managerService = new ManagerService();

  //관리자 권한 부여
  newManager = async (req, res, next) => {
    try {
      const { targetUser } = req.body; //권한을 부여할 대상

      if (targetUser == 0 || targetUser == null) {
        return res.status(400).send({ message: "없는 사람입니다." });
      }

      const newManager = await this.managerService.newManager(targetUser);

      console.log(newManager);
      if (newManager) {
        return res
          .status(200)
          .json({ Message: "새로운 관리자!", data: newManager });
      } else {
        return res
          .status(400)
          .json({ Message: "이미 관리자!", data: newManager });
      }
    } catch (error) {
      next(error);
    }
  };

  //모든 신고글 가져오기
  allReport = async (req, res, next) => {
    try {
      const { userKey, grade } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }
      if (grade == 0 || grade == null) {
        return res.status(400).send({ message: "당신은 관리자가 아닙니다." });
      }
      const allReport = await this.managerService.allReport();
      res.status(200).json({ Message: "미처리된 신고", data: allReport });
    } catch (error) {
      next(error);
    }
  };

  //처벌
  punishment = async (req, res, next) => {
    try {
      const { reportId } = req.params;
      const { userKey, grade } = res.locals.user;
      const { isGuilty } = req.body; //0이면 용서, 1이면 제재
      //isGuilty가 0이면 용서, 1이면 유죄
      //

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      if (grade == 0 || grade == null) {
        return res.status(400).send({ message: "당신은 관리자가 아닙니다." });
      }

      const check = await this.managerService.check(reportId);
      console.log(check);
      if (check) {
        return res.status(400).send({ message: "이미 처리된 신고 입니다." });
      }

      if (isGuilty == 0) {
        const forgive = await this.managerService.forgive(reportId);
        return res.status(200).json({ Message: "봐줌", data: forgive });
      } else if (isGuilty == 1) {
        const education = await this.managerService.education(reportId);
        res.status(200).json({ Message: "참교육 성공", data: education });
      }
    } catch (error) {
      next(error);
    }
  };
}
module.exports = ManagerController;
