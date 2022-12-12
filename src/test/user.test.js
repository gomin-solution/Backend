const UserService = require("../services/users.service");
const userService = new UserService();
userService.redisCli = jest.fn();
// userService.SocketIO = jest.fn();
// userService.server = jest.fn();
// userService.io = jest.fn();

const userId = "testtest";
const nickname = "테스터";
const password = "abcd1234!";

const userdata = {
  userId: "newtest",
  nickname: "새로운테스터",
  password: "$2b$12$CQMwG7zYClwe3VRhWT5ZRen.xEGOeMId1quxk1xUCtfDvNLwMMway",
  isAdult: true,
};

//레디스를 주석처리하지 않으면서 무력화할 방법이 필요함
describe("회원가입", () => {
  test("아이디 생성", async () => {
    userService.userRepository.createUser = jest.fn(() => userdata);

    expect(await userService.createUser());
  });

  //   test("아이디 생성", async () => {});
  //   test("아이디 생성", async () => {});
  //   test("아이디 생성", async () => {});
  //   test("아이디 생성", async () => {});
  //   test("아이디 생성", async () => {});
});
