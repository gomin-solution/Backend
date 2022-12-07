// //const { createchoice } = require("../repositories/choice.repository");
// const ChoiceController = require("../controllers/choice.controller");
// const ChoiceService = require("../services/choice.service");
// const { User, Choice, isChoice, ChoiceBM } = require("../models");

// // jest.mock("../models/choice");
// choiceController = new ChoiceController();
// choiceService = new ChoiceService();
// //jest.mock(choiceService);
// jest.mock("../services/choice.service");

// describe("초이스 컨트롤러", () => {
//   const res = {
//     status: jest.fn(() => 201),
//     send: jest.fn(),
//     locals: { user: 1 },
//   };
//   const req = {
//     body: {
//       title: { title: "타이틀" },
//       choice1Name: { choice1Name: "선택지 1" },
//       choice2Name: { choice2Name: "선택지 2" },
//       endTime: { endTime: "2022-12-15 22:07:34" /*new Date*/ },
//     },
//   };
//   const next = jest.fn();
//   const ans = {
//     message: "투표 등록이 완료되었습니다.",
//     data: {
//       choiceId: 25,
//       userKey: 1,
//       title: "타이틀",
//       choice1Name: "선택지 1",
//       choice2Name: "선택지 2",
//       endTime: "2022-12-15T13:07:34.000Z",
//       choice1Per: 0,
//       choice2Per: 0,
//       choiceCount: 0,
//       isEnd: false,
//       updatedAt: "2022-12-05T11:36:53.794Z",
//       createdAt: "2022-12-05T11:36:53.794Z",
//     },
//   };
//   console.log(choiceController.createchoice.createchoice);

//   console.log(choiceController);
//   console.log(choiceController.createchoice(req, res, next));
//   console.log("=================");
//   console.log(choiceController.createchoice);
//   console.log(typeof choiceController.createchoice);
//   console.log("=================++++++++++");
//   //console.log(choiceController.createchoice.mockReturnValue());
//   console.log(this.choiceService);

//   console.log(typeof choiceController.createchoice);
//   test("초이스컨트롤러 => 초이스생성", async () => {
//     // Choice.create.mockReturnValue(Promise.resolve({
//     //     createchoice
//     // }))
//     // createchoice.mockReturnValue(
//     //   Promise.resolve({
//     //     addFollowing(userKey, title, choice1Name, choice2Name, endTime) {
//     //     },
//     //   })
//     // );

//     // choiceController.createchoice.choiceService.createchoice.mockReturnValue({
//     //   message: "투표 등록이 완료되었습니다.",
//     //   data: {
//     //     choiceId: 25,
//     //     userKey: 1,
//     //     title: "타이틀",
//     //     choice1Name: "선택지 1",
//     //     choice2Name: "선택지 2",
//     //     endTime: "2022-12-15T13:07:34.000Z",
//     //     choice1Per: 0,
//     //     choice2Per: 0,
//     //     choiceCount: 0,
//     //     isEnd: false,
//     //     updatedAt: "2022-12-05T11:36:53.794Z",
//     //     createdAt: "2022-12-05T11:36:53.794Z",
//     //   },
//     // });
//     //choiceController.createchoice.ChoiceService.createchoice.mockReturnValue();

//     // choiceService;

//     choiceController.createchoice.mockReturnValue();

//     this.choiceService.mockReturnValue(
//       Promise.resolve({
//         addFollowing(id) {
//           return Promise.resolve(true);
//         },
//       })
//     );
//     await createchoice(req, res, next);
//     expect(res.send).toBeCalledWith("success");
//   });

//   //이게 맞나?????

//   //   test("모든 초이스 가져오기", async () => {
//   //     await choicechoiceController.findAllchoice(userKey);
//   //     expect();
//   //   });

//   //왠지 이건 아닌거 같음
// });
