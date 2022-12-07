// const ChoiceController = require("../controllers/choice.controller");
// const ChoiceService = require("../services/choice.service");
// const choiceService = new ChoiceService();
// const choiceController = new ChoiceController(); //테스트 대상을 가져옴
// jest.mock("../models/choice");
// jest.mock("../repositories/choice.repository");
// jest.mock("../services/choice.service");

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

// describe("choice컨트롤러 테스트", () => {
//   const res = {
//     status: jest.fn(() => res),
//     send: jest.fn(),
//     userKey: 1,
//   };
//   const req = {
//     title: { title: "타이틀" },
//     choice1Name: { choice1Name: "선택지 1" },
//     choice2Name: { choice2Name: "선택지 2" },
//     endTime: { endTime: "2022-11-26 22:16:18" /*new Date*/ },
//   };

//   const createchoice = {
//     userKey: 1,
//     title: "타이틀",
//     choice1Name: { choice1Name: "선택지 1" },
//     choice2Name: { choice2Name: "선택지 2" },
//     endTime: { endTime: "2022-11-26 22:16:18" },
//   };

//   const next = jest.fn();

//   test("choice를 생성", async () => {
//     choiceController.createchoice.createchoice.mockReturnValue(
//       createchoice

//       // Promise.resolve({
//       //   addFollowing(chiceId) {
//       //     return Promise.resolve(true);
//       //   },
//       // })
//     );
//     expect(res.send).toBeCalledWith({
//       message: "투표 등록이 완료되었습니다.",
//       data: createchoice,
//     });
//   });
// });

// describe("초이스", () => {
//   const userKey = 1;
//   const choiceId = 1;
//   const choiceNum = 1;

//   const res = {
//     status: jest.fn(() => res),
//     json: jest.fn(),
//   };

//   test("투표를 할 경우 투표결과를 출력", async () => {
//     const req = {};

//     //expect(res.status).toBeCalledWith(200);
//     expect(res.json).toBeCalledWith({
//       message: "1번에 투표 성공",
//       data: {
//         choice1Per: 67,
//         choice2Per: 33,
//         count: 3,
//       },
//     });
//   });
// });
