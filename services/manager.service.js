const ManagerRepository = require("../repositories/manager.repository"); //리포지토리의 내용을 가져와야한다.

class ManagerService {
  managerRepository = new ManagerRepository();

  //관리자 권한 부여
  newManager = async (targetUser) => {
    const grade = 1;
    const newManager = await this.managerRepository.newManager(
      targetUser,
      grade
    );
    return newManager;
  };

  //신고게시글 목록 가져오기, 이중 처리가 완료된 데이터는 가져오지 않음
  allReport = async () => {
    const allReport = await this.managerRepository.allReport();
    return allReport;
  };

  //신고게시글 제재 먹이기
  education = async (reportId) => {
    const education = await this.managerRepository.education(reportId);
    return education;
  };

  //신고게시글 봐주기
  forgive = async (reportId) => {
    const forgive = await this.managerRepository.forgive(reportId);
    return forgive;
  };
}

module.exports = ManagerService;
