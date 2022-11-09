const BookMarkRepository = require("../repositories/bookmark.repository");

class BookMarkService {
  bookmarkRepository = new BookMarkRepository();

  updateChoiceBM = async (userKey, choiceId) => {
    //북마크 없으면 생성
    const createBookmark = await this.bookmarkRepository.addChoiceBm(
      userKey,
      choiceId
    );

    //북마크가 있을시 삭제
    if (!createBookmark) {
      await this.bookmarkRepository.cancelChoiceBm(userKey, choiceId);
      return { msg: "취소 되었습니다" };
    }

    return { msg: "등록 되었습니다" };
  };

  updateAdviceBM = async (userKey, adviceId) => {
    //북마크 없으면 생성
    const createBookmark = await this.bookmarkRepository.addAdviceBm(
      userKey,
      adviceId
    );

    //북마크가 있을시 삭제
    if (!createBookmark) {
      await this.bookmarkRepository.cancelAdviceBm(userKey, adviceId);
      return { msg: "취소 되었습니다" };
    }

    return { msg: "등록 되었습니다" };
  };
}

module.exports = BookMarkService;
