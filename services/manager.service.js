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
    const allReport = await this.managerRepository.allReport(); //이것은 몽고디비서 가져옴
    // const userReport = await this.managerRepository.userReport();//이것은 MYSQL에서 가져옴
    let array = new Array();
    for (let i = 0; i < allReport.length; i++) {
      let a = new Array();
      let key = allReport[i].ids.reporterId;

      const userReport = await this.managerRepository.userReport(key); //이것은 MYSQL에서 가져옴
      console.log("----------------------------------------");

      a.push(allReport[i]);
      a.push(userReport);
      console.log(a);
      array.push(a);
      a = [];
    }
    return array;
    //return allReport;
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

  //이미 신고 처리가 완료된 것인가???
  check = async (reportId) => {
    const check = await this.managerRepository.check(reportId);
    if (check[0].processing == false) {
      return;
    }
    return check;
  };
}

module.exports = ManagerService;
