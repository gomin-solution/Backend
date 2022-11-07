const { Router } = require("express");
const adviceRouter = Router();
// const upload = require("../modules/advice.multer");

const authMiddleware = require("../middlewares/authMiddleware");

const AdviceController = require("../controllers/advice.controller");
const adviceController = new AdviceController();

//조언 게시글 업로드
// adviceRouter.post("/advice", authMiddleware, upload.array("image", 5), adviceController.creatAdvice);
// adviceRouter.post("/advice", upload.array("image", 5), adviceController.creatAdvice);
module.exports = adviceRouter;
