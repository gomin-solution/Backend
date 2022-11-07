const express = require("express");
const router = express.Router();
const userRouter = require("./user.routes");
const adviceRouter = require("./advice.routes");

router.use("/", userRouter);

// 조언 게시글
router.use("/advice", adviceRouter);

module.exports = router;
