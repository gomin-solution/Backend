const ErrorCustom = require("../exceptions/error-custom");
const { ValidationError } = require("sequelize");
const AdviceRepository = require("../repositories/advice.repository");
const dayjs = require("dayjs");

class AdviceService {
  adviceRepository = new AdviceRepository();

  // 게시물 생성
  createAdvice = async (userKey, title, categoryId, content) => {
    const createAdviceData = await this.adviceRepository.createAdvice(
      userKey,
      title,
      categoryId,
      content
    );

    return createAdviceData;
  };

  // 조언 게시물 전체 조회
  findAllAdvice = async (adviceSort) => {
    const findAllAdvice = await this.adviceRepository.findAllAdvice();

    const data = findAllAdvice.map((post) => {
      const date = dayjs(post.createdAt)
        .subtract(3, "h")
        .format("YYYY.MM.DD HH:mm");

      return {
        adviceId: post.adviceId,
        userKey: post.userKey,
        categoryId: post.categoryId,
        title: post.title,
        content: post.content,
        createdAt: date,
        userImage: post.User.userImg,
        nickname: post.User.nickname,
        viewCount: post.viewCount,
        category: post.Category.name,
        commentCount: post.Comments.length,
      };
    });

    if (adviceSort == "최신순") {
      data.sort((a, b) => b.createdAt - a.createdAt);
    }
    if (adviceSort == "조회순") {
      data.sort((a, b) => b.viewCount - a.viewCount);
    }
    if (adviceSort == "댓글순") {
      data.sort((a, b) => b.commentCount - a.commentCount);
    }

    return data;
  };

  // 조언 게시물 카테고리별 조회
  findCategoryAdvice = async (categoryId, adviceSort) => {
    const findCategoryAdvice = await this.adviceRepository.findCategoryAdvice(
      categoryId
    );
    const data = findCategoryAdvice.map((post) => {
      const date = dayjs(post.createdAt)
        .subtract(3, "h")
        .format("YYYY.MM.DD HH:mm");
      return {
        adviceId: post.adviceId,
        userKey: post.userKey,
        categoryId: post.categoryId,
        title: post.title,
        content: post.content,
        createdAt: date,
        userImage: post.User.userImg,
        nickname: post.User.nickname,
        viewCount: post.viewCount,
        category: post.Category.name,
        commentCount: post.Comments.length,
      };
    });
    if (adviceSort == "최신순") {
      data.sort((a, b) => b.createdAt - a.createdAt);
    }
    if (adviceSort == "조회순") {
      data.sort((a, b) => b.viewCount - a.viewCount);
    }
    if (adviceSort == "댓글순") {
      data.sort((a, b) => b.commentCount - a.commentCount);
    }
    return data;
  };

  //  조언 게시물 상세페이지 조회
  findOneAdvice = async (userKey, adviceId, commentSort) => {
    const findOneAdvice = await this.adviceRepository.findOneAdvice(
      userKey,
      adviceId
    );

    const findAdviceImageArray = findOneAdvice.AdviceImages.map((post) => {
      return [post.dataValues.adviceImageId, post.adviceImage];
    });

    const comment = findOneAdvice.Comments.map((comment) => {
      const isLike = comment.CommentLikes.filter(
        (like) => like.userKey === userKey
      );
      let boolean;
      isLike.length ? (boolean = true) : (boolean = false);
      const date = dayjs(comment.createdAt)
        .subtract(3, "h")
        .format("YYYY.MM.DD HH:mm");
      return {
        commentId: comment.commentId,
        userKey: comment.userKey,
        nickname: comment.User.nickname,
        userImg: comment.User.userImg,
        comment: comment.comment,
        likeCount: comment.CommentLikes.length,
        createdAt: date,
        isLike: boolean,
      };
    });
    // commentSort
    /*등록순, 좋아요순*/
    if (commentSort == "등록순") {
      comment.sort((a, b) => b.createdAt - a.createdAt);
    }
    if (commentSort == "좋아요순") {
      comment.sort((a, b) => b.likeCount - a.likeCount);
    }

    let boolean;
    findOneAdvice.AdviceBMs.length ? (boolean = true) : (boolean = false);
    const createdAt = dayjs(findOneAdvice.createdAt)
      .subtract(3, "h")
      .format("YYYY.MM.DD HH:mm");
    const updatedAt = dayjs(findOneAdvice.updatedAt)
      .subtract(3, "h")
      .format("YYYY.MM.DD HH:mm");
    return {
      adviceId: findOneAdvice.adviceId,
      categoryId: findOneAdvice.categoryId,
      category: findOneAdvice.Category.name,
      userKey: findOneAdvice.User.userKey,
      title: findOneAdvice.title,
      content: findOneAdvice.content,
      createdAt: createdAt,
      updatedAt: updatedAt,
      userImage: findOneAdvice.User.userImg,
      nickname: findOneAdvice.User.nickname,
      adviceImage: findAdviceImageArray,
      viewCount: findOneAdvice.viewCount,
      isBookMark: boolean,
      commentCount: findOneAdvice.Comments.length,
      comment: comment,
    };
  };

  // 이미지 찾기(조언 게시글 수정용)
  findImages = async (imageId) => {
    const findImage = await this.adviceRepository.findImages(imageId);
    return findImage;
  };

  // 조언 게시물 타이틀 수정
  updateAdviceTitle = async (adviceId, title) => {
    const findAdvice = await this.adviceRepository.findAllAdvice(adviceId);
    if (!findAdvice) throw new ErrorCustom(400, "게시물이 존재하지 않습니다.");

    await this.adviceRepository.updateAdviceTitle(adviceId, title);
  };

  // 조언 게시물 콘텐츠 수정
  updateAdviceContent = async (adviceId, content) => {
    const findAdvice = await this.adviceRepository.findAllAdvice(adviceId);
    if (!findAdvice) throw new ErrorCustom(400, "게시물이 존재하지 않습니다.");

    await this.adviceRepository.updateAdviceContent(adviceId, content);
  };

  // 조언 게시물 조회 수
  upCountView = async (adviceId, userKey) => {
    const findAdvice = await this.adviceRepository.findAdvice(adviceId);

    if (userKey !== findAdvice.userKey) {
      await this.adviceRepository.upCountView(adviceId);
    }
  };

  // 조언 게시물 삭제
  adviceDelete = async (adviceId) => {
    await this.adviceRepository.adviceDelete(adviceId);
  };

  //내가쓴 조언게시물 조회
  myadvice = async (userKey) => {
    const myadvice = await this.adviceRepository.myadvice(userKey);

    return myadvice.map((post) => {
      return {
        adviceId: post.adviceId,
        userKey: post.userKey,
        categoryId: post.categoryId,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        userImage: post.User.userImg,
        nickname: post.User.nickname,
        viewCount: post.viewCount,
      };
    });
  };
  reportAdvice = async (userKey, adviceId) => {
    //작성자 확인
    let type = "advice";
    const writer = await this.adviceRepository.findAdvice(adviceId);
    const writerHost = writer.userKey;
    console.log(writerHost);

    if (userKey === writerHost) {
      return;
    }
    const reportAdvice = await this.adviceRepository.reportAdvice(
      userKey,
      adviceId,
      writerHost,
      type
    );
    return reportAdvice;
  };
}

module.exports = AdviceService;
