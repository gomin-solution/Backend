const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const ReportCon = require("../controllers/report.controller");
const reportCon = new ReportCon();

//신고하기 통합 기능
router.post("/report/:targetId", auth, reportCon.report);

module.exports = router;
