const AdviceService = require("../services/advice.service");
const adviceService = new AdviceService();

const userKey = 1;
const title = "새로운 어드바이스";
const categoryId = 2;
const content = "어드바이스의 컨텐츠";
const isAdult = true;

const data = {
  userKey: 1,
  title: "새로운 어드바이스",
  categoryId: 2,
  content: "어드바이스의 컨텐츠",
};
const adviceId = 2;

describe("advice서비스 테스트", () => {
  test("createAdvice가 성공하는가?", async () => {
    adviceService.adviceRepository.createAdvice = jest.fn(() => data);
    expect( // 다음과 같은 결과가 나와야한다.
      await adviceService.createAdvice(userKey, title, categoryId, content)
    ).toEqual(
      data);
  });

  test("findAllAdviceOne이 성공하는가?", async () => {
    adviceService.adviceRepository.findAllAdviceOne = jest.fn(() => data);
    expect(await adviceService.findAllAdviceOne()).toEqual(data);
  });

  //리턴 값이 없기 때문에 익스펙트에 아무것도 들어가지 않음
  test("updateAdviceTitle이 성공하는가?", async () => {
    adviceService.adviceRepository.findAllAdvice = jest.fn(() => data);
    adviceService.adviceRepository.updateAdviceTitle = jest.fn(() => {
      title: "새로운 수정된 새로운 타이틀";
    });
    expect(await adviceService.updateAdviceTitle(adviceId, title)).toEqual();
  });

  test("updateAdviceContent이 성공하는가?", async () => {
    adviceService.adviceRepository.findAllAdvice = jest.fn(() => data);
    adviceService.adviceRepository.updateAdviceTitle = jest.fn(() => {
      content: "새로운 수정된 컨텐츠";
    });
    expect(
      await adviceService.updateAdviceContent(adviceId, content)
    ).toEqual();
  });

  test("adviceDelete가 성공하는가?", async () => {
    adviceService.adviceRepository.adviceDelete = jest.fn(() => data);
    adviceService.adviceRepository.adviceDelete = jest.fn();
    expect(await adviceService.adviceDelete(userKey)).toEqual();
  });

  test("adviceDelete가 성공하는가?", async () => {
    adviceService.adviceRepository.adviceDelete = jest.fn(() => data);
    adviceService.adviceRepository.adviceDelete = jest.fn();
    expect(await adviceService.adviceDelete(userKey)).toEqual();
  });
});
