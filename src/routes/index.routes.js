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

//로그인,회원가입,메인페이지
router.use("/api", userRouter);

router.use("/api/bookmark", bookMarkRouter);

// 조언 게시글
router.use("/api/advice", adviceRouter);

// 투표 게시글 관련
router.use("/api", choiceRouter);

// 조언 게시글의 덧글 관련
router.use("/api/advice/comment", commentRouter);

// 쪽지 관련
router.use("/api", noteRouter);

// 관리자 관련
router.use("/api", managerRouter);

// 신고 관련
router.use("/api", reportRouter);

module.exports = router;
