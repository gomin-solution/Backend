const authMiddleware = require("../middlewares/authMiddleware");
const UserController = require("../controllers/user.controller");
const redis = require("redis-mock");

describe("미들웨어", () => {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    locals: jest.fn(() => res),
    user: jest.fn(),
  };
  const next = jest.fn();

  test("헤더에 토큰이 없는 경우 에러 메세지 응답", async () => {
    const req = {
      headers: "undefined",
    };
    await authMiddleware(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({ message: "잘못된 요청입니다." });
  });

  test("토큰타입이 Bearer가 아닌경우 에러 메세지 응답", async () => {
    const req = {
      headers: {
        authorization: "NoBearer undefined",
        refreshtoken: "NoBearer undefined",
      },
    };
    await authMiddleware(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "잘못된 요청입니다. 다시 로그인 해주세요",
    });
  });

  test("토큰이 정상적으로 없는 경우 익명 유저 정보를 담고 next호출", async () => {
    const req = {
      headers: {
        authorization: "Bearer undefined",
        refreshtoken: "Bearer undefined",
      },
    };
    await authMiddleware(req, res, next);

    expect(res.locals.user).toBeDefined({ userKey: 0, userId: "Anonymous" });

    expect(next).toBeCalledTimes(1);
  });

  test("토큰타입이 Bearer인 경우 next호출", async () => {
    const req = {
      headers: { authorization: "Bearer undefined" },
    };
    await authMiddleware(req, res, next);

    expect(next).toBeCalledTimes(1);
  });
});
