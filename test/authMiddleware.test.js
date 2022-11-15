const authMiddleware = require("../middlewares/authMiddleware");
const UserController = require("../controllers/user.controller");

describe("미들웨어", () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  test("토큰타입이 Bearer가 아닌경우 에러 메세지 응답", async () => {
    const req = {
      headers: { authorization: "Beare undefined" },
    };
    await authMiddleware(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "잘못된 요청입니다. 다시 로그인 해주세요",
    });
  });

  test("토큰타입이 Bearer인 경우 next호출", async () => {
    const req = {
      headers: { authorization: "Bearer undefined" },
    };
    await authMiddleware(req, res, next);

    expect(next).toBeCalledTimes(1);
  });
});
