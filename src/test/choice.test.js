const ChoiceService = require("../services/choice.service");
const choiceService = new ChoiceService();

const userKey = 1;
const title = "새로운 초이스";
const choice1Name = "선택지 1";
const choice2Name = "선택지 2";
const date = "2022-12-12T13:07:34.000Z";

const data = {
  userKey: 1,
  title: "새로운 초이스",
  choice1Name: "선택지 1",
  choice2Name: "선택지 2",
  date: "2022-12-12T13:07:34.000Z",
};

describe("choice서비스 테스트", () => {
  test("createchoice가 성공하는가?", async () => {
    choiceService.choiceRepository.createchoice = jest.fn(() => ({
      title: "새로운 루트",
    }));
    expect(
      await choiceService.createchoice(
        userKey,
        title,
        choice1Name,
        choice2Name,
        date
      )
    ).toEqual({
      title: "새로운 루트",
    });
  });
});