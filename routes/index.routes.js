const express = require("express");
const router = express.Router();
const userRouter = require("./user.routes");
const adviceRouter = require("./advice.routes");
const bookMarkRouter = require("./bookmark.routes");
const passportConfig = require("../passport");

const choiceRouter = require("./choice.routes");
const commentRouter = require("./comment.routes");
const noteRouter = require("./note.routes");
// const kakaoCallback = require("./kakao.routes")
const kakaoRouter = require("./kakao.routes");
const managerRouter = require("./manager.routes");
passportConfig();
//로그인,회원가입,메인페이지
router.use("/", userRouter);

router.use("/bookmark", bookMarkRouter);

// 조언 게시글
router.use("/advice", adviceRouter);

// 투표 게시글 관련
router.use("/", choiceRouter);

// 조언 게시글의 덧글 관련
router.use("/advice/comment", commentRouter);

router.use("/", kakaoRouter);

// 쪽지 관련
router.use("/note", noteRouter);

// 관리자 관련
router.use("/", managerRouter);

module.exports = router;
