const AdviceImageService = require("../services/adviceimage.service");
const adviceImageService = new AdviceImageService();

const adviceId = 1;
const imageUrl = 'https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/adviceimage/1670808790604_4126.jpg';

const data = {
    adviceId: 1,
    imageUrl: 'https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/adviceimage/1670808790604_4126.jpg'
}

describe("advice 이미지 테스트", () => {
    test("image가 등록되는가?", async () => {
        adviceImageService.adviceImageRepository.createAdviceImage = jest.fn(() => data);
        expect( // 다음과 같은 결과가 나와야한다.
          await adviceImageService.createAdviceImage(adviceId, imageUrl)
        ).toEqual(
          data);
    });
    
    test("adviceImageDelete가 성공하는가?", async () => {
        adviceImageService.adviceImageRepository.imageDelete = jest.fn(() => data);
        adviceImageService.adviceImageRepository.imageDelete = jest.fn();
        expect(await adviceImageService.imageDelete(adviceId)).toEqual();
    });
})