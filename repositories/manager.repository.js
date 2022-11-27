const { User } = require("../models"); //모델 데이터를 가져오고
const { Op } = require("sequelize");
const Report = require("../schemas/report");

class ManagerRepository {
  //관리자 권한 부여
  newManager = async (targetUser, grade) => {
    const dup = await User.findOne({ where: { userKey: targetUser } });
    if (dup.grade == 1) {
      return;
    }

    const newManager = await User.update(
      { grade },
      { where: { userKey: targetUser } }
    );
    console.log(newManager);
    return newManager;
  };

  //신고게시글 목록 가져오기
  allReport = async () => {
    const allReports = await Report.find({ processing: false });
    return allReports;
  };

  //이건 임시용, 유저 아이디 가져오기
  userReport = async (userKey) => {
    const userReport = await User.findOne({ where: { userKey: userKey } });
    return userReport;
  };

  //신고게시글 제재 먹이기
  education = async (reportId) => {
    const guilty = true;
    const processing = true;
    const data = await Report.updateOne(
      { reportId: Number(reportId) },
      { $set: { guilty, processing } }
    );
    return data;
  };

  //신고게시글 봐주기
  forgive = async (reportId) => {
    const processing = true;
    const data = await Report.updateOne(
      { reportId: Number(reportId) },
      { $set: { processing } }
    );
    return data;
  };

  //이미 신고된 게시글인가?
  check = async (reportId) => {
    const check = await Report.find({ reportId: reportId });
    return check;
  };
}

module.exports = ManagerRepository;
