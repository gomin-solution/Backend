const ReportSer = require("../services/report.service");

class ReportCon {
  reportSer = new ReportSer();

  /**신고하기 */
  report = async (req, res, next) => {
    try {
      const { targetId } = req.params;
      const { userKey } = res.locals.user;
      const { why, targetName } = req.body;
      console.log("why:" + why, "targetName:" + targetName);
      if (userKey == 0) {
        return res.status(400).send({ message: "로그인 하시기 바랍니다." });
      }

      const update = await this.reportSer.report(
        userKey,
        targetId,
        why,
        targetName
      );

      if (update === false) {
        return res.status(400).json({ Message: "중복된 신고 입니다." });
      }

      let mes;
      if (!update) {
        mes = "본인은 신고 할 수 없습니다"; //본인이 작성한 게시글 본인이 신고한 경우
        return res.status(400).json({ Message: mes });
      } else {
        mes = "신고 성공";
      }

      res.status(200).json({ Message: mes });
    } catch (error) {
      next(error);
    }
  };
}
module.exports = ReportCon;
