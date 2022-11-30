const ReportRepo = require("../repositories/report.repository"); //리포지토리의 내용을 가져와야한다.

class ReportSer {
  reportRepo = new ReportRepo();

  //신고하기 통합
  report = async (userKey, targetId, why, targetName) => {
    //먼저, 이 게시글을 누가 썼는지부터 확인한다.
    const author = await this.reportRepo.author(targetId, targetName);

    //작성자 본인이 이 글을 신고한 것인가??
    if (author.userKey === userKey) {
      return;
    }

    //작성자 본인이 신고를 한 것이 아니라면 중복 확인을 한다
    const redup = await this.reportRepo.redup(
      userKey,
      author.userKey,
      targetId,
      targetName
    );
    //중복된게 맞다면 false를 컨트롤러로 반환
    if (redup[0]) {
      const dupmes = false;
      return dupmes;
    }

    //문제가 없다면 신고게시글을 추가한다.
    const report = await this.reportRepo.report(
      userKey,
      author.userKey,
      targetId,
      targetName,
      why,
      author
    );

    return report;
  };
}

module.exports = ReportSer;
