const express = require("express");
const router = express.Router();
const userRouter = require("./user.routes");
const adviceRouter = require("./advice.routes");

router.use("/", userRouter);

// 게시글 작성
router.use("/post", adviceRouter);

// 조언 게시글 조회
router.use("/advice", adviceRouter);

module.exports = router;
