const { Router } = require("express");
const adviceRouter = Router();
const upload = require("../modules/advice.multer");

const authMiddleware = require("../middlewares/authMiddleware");

const AdviceController = require("../controllers/advice.controller");
const adviceController = new AdviceController();

//조언 게시글 업로드
adviceRouter.post(
  "/",
  authMiddleware,
  upload.array("image", 3),
  adviceController.creatAdvice
);

//조언 게시글 조회
adviceRouter.get("/category/:categoryId", authMiddleware, adviceController.allAdvice)

//조언 게시글 상세조회
adviceRouter.get("/:adviceId", authMiddleware, adviceController.findAdvice)

//조언 게시글 수정
//adviceRouter.put("/:adviceId", authMiddleware, adviceController.updateAdvice);

module.exports = adviceRouter;
