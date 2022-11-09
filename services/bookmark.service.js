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

  findBmChoice = async (userKey) => {
    const findBmChoice = await this.bookmarkRepository.findBmChoice(userKey);

    const result = findBmChoice.map((post) => {
      return {
        choiceId: post.Choice.choiceId,
        title: post.Choice.title,
        choice1Name: post.Choice.choice1Name,
        choice2Name: post.Choice.choice2Name,
        choice1Per: post.Choice.choice1Per,
        choice2Per: post.Choice.choice2Per,
        userImage: post.Choice.User.userImage,
        nickname: post.Choice.User.nickname,
        createdAt: post.Choice.createdAt,
        endTime: post.Choice.endTime,
        choiceCount: post.Choice.choiceCount,
        userKey: post.Choice.userKey,
        isBookmark: true,
        isChoice: null,
      };
    });

    return result;
  };

  findBmAdvice = async (userKey) => {
    const findBmAdvice = await this.bookmarkRepository.findBmAdvice(userKey);

    const result = findBmAdvice.map((post) => {
      return {
        adviceId: post.Advice.adviceId,
        title: post.Advice.title,
        content: post.Advice.content,
        createdAt: post.Advice.createdAt,
        userKey: post.Advice.userKey,
        CommentCount: post.Advice.Comments.length,
      };
    });

    return result;
  };
}

module.exports = BookMarkService;
