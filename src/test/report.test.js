const ReportService = require("../services/report.service");
const reportService = new ReportService();

const why = "그냥";
const targetName = "comment";
const targetId = 3;
const userKey = 1;
const authorId = 3;

const reportData = {
  why: "그냥",
  targetName: "comment",
  targetId: 3,
  userKey: 1,
};

const redupData = {};

describe("리포트 테스트", () => {
  test("report가 성공하는가?", async () => {
    const author = {
      userKey: 3,
    };
    reportService.reportRepo.author = jest.fn(() => {
      reportData;
    });
    reportService.reportRepo.redup = jest.fn(() => {
      userKey, authorId, targetId, targetName;
    });
    reportService.reportRepo.report = jest.fn(() => {
      userKey, authorId, targetId, targetName, why, reportData;
    });

    expect(await reportService.report(userKey, targetId, why)).toEqual(
      reportData
    );
  });
  test("", () => {});
});
