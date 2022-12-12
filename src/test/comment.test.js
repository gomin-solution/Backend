const CommentService = require("../services/comment.service");
const commentService = new CommentService();
const Error = require("../exceptions/error-custom");
const error = new Error();

const adviceId = 1;
const userKey = 1;
const comment = "새로운 댓글";
const commentId = 2;

describe("코멘트 기능 테스트", () => {
  test("코멘트 생성", async () => {
    const error = new Error();
    console.log(userKey);
    commentService.adviceRepository.findAdvice = jest.fn(() => ({
      userKey: 1,
    }));
    console.log(userKey);
    commentService.commentRepository.createComment = jest.fn(() => ({
      comment: "덧글 덧글",
    }));

    expect(
      await commentService.createComment(userKey, adviceId, comment)
    ).toEqual({
      comment: "덧글 덧글",
    });
  });

  test("코멘트 수정", async () => {
    commentService.adviceRepository.updateComment = jest.fn(() => ({
      userKey: "수정된 덧글",
    }));

    expect(
      await commentService.updateComment(userKey, commentId, comment)
    ).toEqual({
      comment: "덧글 덧글",
    });
  });

  //   test("createAdvice가 성공하는가?", async () => {
  //     adviceService.adviceRepository.createAdvice = jest.fn(() => ({
  //       title: "새로운 어드바이스",
  //     }));
  //     expect(
  //       await adviceService.createAdvice(userKey, title, categoryId, content)
  //     ).toEqual({
  //       title: "새로운 어드바이스",
  //     });
  //   });
});
