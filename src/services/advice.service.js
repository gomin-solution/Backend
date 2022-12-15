const ErrorCustom = require("../exceptions/error-custom");
const AdviceRepository = require("../repositories/advice.repository");
const UserRepository = require("../repositories/users.repository");
const MissionRepository = require("../repositories/mission.repository");
const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

class AdviceService {
  adviceRepository = new AdviceRepository();
  userRepository = new UserRepository();
  missionRepository = new MissionRepository();

  // 게시물 생성
  createAdvice = async (userKey, title, categoryId, content, isAdult) => {
    const createAdviceData = await this.adviceRepository.createAdvice(
      userKey,
      title,
      categoryId,
      content,
      isAdult
    );

    //답해주기 게시글 작성 횟수 +1
    await this.missionRepository.postAdviceActivity(userKey);
    return createAdviceData;
  };

  findAllAdviceOne = async (adviceId) => {
    const findAllAdvice = await this.adviceRepository.findAllAdviceOne(
      adviceId
    );
    return findAllAdvice;
  };

  // 조언 게시물 전체 조회
  findAllAdvice = async (categoryId, filterId, page) => {
    if (categoryId == 0) {
      const findAllAdvice = await this.adviceRepository.findAllAdvice();

      const data = findAllAdvice.map((post) => {
        const date = dayjs(post.createdAt).tz().format("YYYY/MM/DD HH:mm");

        let userImage = "";
        if (
          post.User.userImg ==
          "https://imgfiles-cdn.plaync.com/file/LoveBeat/download/20200204052053-LbBHjntyUkg2jL3XC3JN0-v4"
        ) {
          userImage =
            "https://imgfiles-cdn.plaync.com/file/LoveBeat/download/20200204052053-LbBHjntyUkg2jL3XC3JN0-v4";
        } else {
          userImage =
            "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage-resize/" +
            post.User.userImg;
        }

        return {
          adviceId: post.adviceId,
          userKey: post.userKey,
          categoryId: post.categoryId,
          title: post.title,
          content: post.content,
          createdAt: date,
          userImage: userImage,
          nickname: post.User.nickname,
          viewCount: post.viewCount,
          category: post.Category.name,
          commentCount: post.Comments.length,
        };
      });

      if (filterId == "0") {
        data.sort((a, b) => b.adviceId - a.adviceId);
      }
      if (filterId == "1") {
        data.sort((a, b) => b.viewCount - a.viewCount);
      }
      if (filterId == "2") {
        data.sort((a, b) => b.commentCount - a.commentCount);
      }

      let advice;
      let arr = [];
      function chunk(data = [], size = 1) {
        arr = [];
        for (let i = 0; i < data.length; i += size) {
          arr.push(data.slice(i, i + size));
        }
        return arr;
      }
      advice = chunk(data, 10)[Number(page)];

      if (!advice) {
        advice = [];
      }

      return advice;
    }

    const findCategoryAdvice = await this.adviceRepository.findCategoryAdvice(
      categoryId
    );

    const data = findCategoryAdvice.map((post) => {
      const date = dayjs(post.createdAt).tz().format("YYYY/MM/DD HH:mm");

      let userImage = "";
      if (
        post.User.userImg ==
        "https://imgfiles-cdn.plaync.com/file/LoveBeat/download/20200204052053-LbBHjntyUkg2jL3XC3JN0-v4"
      ) {
        userImage =
          "https://imgfiles-cdn.plaync.com/file/LoveBeat/download/20200204052053-LbBHjntyUkg2jL3XC3JN0-v4";
      } else {
        userImage =
          "https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/profileimage-resize/" +
          post.User.userImg;
      }

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

    if (filterId == "0") {
      data.sort((a, b) => b.adviceId - a.adviceId);
    }
    if (filterId == "1") {
      data.sort((a, b) => b.viewCount - a.viewCount);
    }
    if (filterId == "2") {
      data.sort((a, b) => b.commentCount - a.commentCount);
    }

    let advice;
    let arr = [];
    function chunk(data = [], size = 1) {
      arr = [];
      for (let i = 0; i < data.length; i += size) {
        arr.push(data.slice(i, i + size));
      }
      return arr;
    }
    advice = chunk(data, 10)[Number(page)];

    if (!advice) {
      advice = [];
    }

    return advice;
  };

  //  조언 게시물 상세페이지 조회
  findOneAdvice = async (userKey, adviceId, filterId) => {
    const findOneAdvice = await this.adviceRepository.findOneAdvice(
      userKey,
      adviceId
    );

    const findCreatedAt = dayjs(findOneAdvice.createdAt).tz();
    const plusThreeSec = findCreatedAt.add(3, "s");
    const findUpdatedAt = dayjs(findOneAdvice.updatedAt).tz();
    const plusUpdateThreeSec = findUpdatedAt.add(3, "s");

    let findAdviceImageArray = [];
    if (dayjs().tz() <= plusThreeSec || dayjs().tz() <= plusUpdateThreeSec) {
      findAdviceImageArray = findOneAdvice.AdviceImages.map((post) => {
        return ["https://hh99projectimage-1.s3.ap-northeast-2.amazonaws.com/adviceimage/" + post.adviceImage];
      });
    } else {
      findAdviceImageArray = findOneAdvice.AdviceImages.map((post) => {
        return ["https://d1zudc9azdqoxt.cloudfront.net/" + post.adviceImage];
      });
    }

    let selectComment;
    const commentArray = [];
    findOneAdvice.Comments.forEach((comment) => {
      const isLike = comment.CommentLikes.filter(
        (like) => like.userKey === userKey
      );
      let boolean;
      isLike.length ? (boolean = true) : (boolean = false);
      const date = dayjs(comment.updatedAt).tz().format("YYYY/MM/DD HH:mm");
      if (comment.CommentSelects.length) {
        selectComment = {
          commentId: comment.commentId,
          userKey: comment.userKey,
          nickname: comment.User.nickname,
          userImg: comment.User.userImg,
          comment: comment.comment,
          likeCount: comment.CommentLikes.length,
          updatedAt: date,
          isLike: boolean,
        };
      } else {
        commentArray.push({
          commentId: comment.commentId,
          userKey: comment.userKey,
          nickname: comment.User.nickname,
          userImg: comment.User.userImg,
          comment: comment.comment,
          likeCount: comment.CommentLikes.length,
          updatedAt: date,
          isLike: boolean,
        });
      }
    });
    // filterId
    /*등록순, 좋아요순*/

    if (filterId == "0") {
      commentArray.sort((a, b) => a.commentId - b.commentId);
    }
    if (filterId == "1") {
      commentArray.sort((a, b) => b.likeCount - a.likeCount);
    }

    if (filterId == "2") {
      commentArray.sort((a, b) => b.commentId - a.commentId);
    }

    let boolean;
    findOneAdvice.AdviceBMs.length ? (boolean = true) : (boolean = false);
    const createdAt = dayjs(findOneAdvice.createdAt)
      .tz()
      .format("YYYY/MM/DD HH:mm");

    const updatedAt = dayjs(findOneAdvice.updatedAt)
      .tz()
      .format("YYYY/MM/DD HH:mm");

    let admin;
    const findUser = await this.userRepository.findUserKey(userKey);
    findUser?.level ? (admin = true) : (admin = false);
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
      selectComment: selectComment,
      comment: commentArray,
      admin: admin,
    };
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
      const createdAt = dayjs(post.createdAt).tz().format("YYYY/MM/DD HH:mm");
      return {
        adviceId: post.adviceId,
        userKey: post.userKey,
        categoryId: post.categoryId,
        category: post.Category.name,
        title: post.title,
        content: post.content,
        createdAt: createdAt,
        userImage: post.User.userImg,
        nickname: post.User.nickname,
        viewCount: post.viewCount,
      };
    });
  };
}

module.exports = AdviceService;
