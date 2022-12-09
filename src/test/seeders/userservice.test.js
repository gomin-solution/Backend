const UserService = require("../../services/users.service");
const userservice = new UserService();

describe("유저 서비스", () => {
  test("유저 생성시 isAdult가 문자열true 일때 레포지토리 호출값에 isAdult가 ture로 들어감", async () => {
    await userservice.createUser;
    await authMiddleware(req, res, next);
    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: "잘못된 요청입니다. 다시 로그인 해주세요",
    });
  });
});
