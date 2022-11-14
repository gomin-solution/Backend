const JsonWebTokenError = require("jsonwebtoken/lib/JsonWebTokenError");
const authMiddleware = require("../middlewares/authMiddleware");

describe("미들웨어", () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  test("토큰타입이 Bearer가 아닌경우 에러 메세지 응답", async () => {
    const req = {
      headers: { authorization: "Beare undefined", refreshtoken: "token" },
    };
    await authMiddleware(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "잘못된 요청입니다. 다시 로그인 해주세요",
    });
  });
});
