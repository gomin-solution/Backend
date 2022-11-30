const ChoiceController = require("../controllers/choice.controller");

describe("초이스", () => {
  const userKey = 1;
  const choiceId = 1;
  const choiceNum = 1;

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  test("투표를 할 경우 투표결과를 출력", async () => {
    const req = {};

    //expect(res.status).toBeCalledWith(200);
    expect(res.json).toBeCalledWith({
      message: "1번에 투표 성공",
      data: {
        choice1Per: 67,
        choice2Per: 33,
        count: 3,
      },
    });
  });
});
