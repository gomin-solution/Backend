const express = require("express");
const router = express.Router();
const userRouter = require("./user.routes");
const adviceRouter = require("./advice.routes");
const bookMarkRouter = require("./bookmark.routes");

const choiceRouter = require("./choice.routes");
const commentRouter = require("./comment.routes");
const noteRouter = require("./note.routes");
const managerRouter = require("./manager.routes");
const reportRouter = require("./report.routes");
const mailRouter = require("./mail.routes");
const pushRouter = require("./push.routes");

//로그인,회원가입,메인페이지
router.use("/", userRouter);

//북마크
router.use("/bookmark", bookMarkRouter);

// 조언 게시글
router.use("/advice", adviceRouter);

// 투표 게시글 관련
router.use("/", choiceRouter);

// 조언 게시글의 덧글 관련
router.use("/advice/comment", commentRouter);

// 쪽지 관련
router.use("/", noteRouter);

// 관리자 관련
router.use("/", managerRouter);

// 신고 관련
router.use("/", reportRouter);

router.use("/mailtest", mailRouter);

//푸쉬알람
router.use("/push", pushRouter);

module.exports = router;
