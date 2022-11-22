const BookMarkRepository = require("../repositories/bookmark.repository");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");
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
      let isChoice;
      post.Choice.isChoices.length ? (isChoice = true) : (isChoice = false);
      let absolute_a = post.Choice.choice1Per;
      let absolute_b = post.Choice.choice2Per;
      let choice1Per;
      let choice2Per;
      if (absolute_a + absolute_b > 0) {
        choice1Per = Math.round((absolute_a / (absolute_a + absolute_b)) * 100);
        choice2Per = 100 - choice1Per;
      }
      const createdAt = dayjs(post.Choice.createdAt)
        .tz()
        .format("YYYY.MM.DD HH:mm");
      const endTime = dayjs(post.Choice.endTime).format("YYYY.MM.DD HH:mm");
      return {
        choiceId: post.Choice.choiceId,
        title: post.Choice.title,
        choice1Name: post.Choice.choice1Name,
        choice2Name: post.Choice.choice2Name,
        choice1Per: choice1Per,
        choice2Per: choice2Per,
        userImage: post.Choice.User.userImage,
        nickname: post.Choice.User.nickname,
        createdAt: createdAt,
        endTime: endTime,
        choiceCount: post.Choice.choiceCount,
        userKey: post.Choice.userKey,
        isBookmark: true,
        isChoice: isChoice,
      };
    });

    return result;
  };

  findBmAdvice = async (userKey) => {
    const findBmAdvice = await this.bookmarkRepository.findBmAdvice(userKey);

    const result = findBmAdvice.map((post) => {
      const createdAt = dayjs(post.Advice.createdAt)
        .tz()
        .format("YYYY.MM.DD HH:mm");
      return {
        adviceId: post.Advice.adviceId,
        title: post.Advice.title,
        content: post.Advice.content,
        createdAt: createdAt,
        userKey: post.Advice.userKey,
        CommentCount: post.Advice.Comments.length,
      };
    });

    return result;
  };
}

module.exports = BookMarkService;
