const { Router } = require("express");
const adviceRouter = Router();
const uploadadvice = require("../modules/advice.multer");

const authMiddleware = require("../middlewares/authMiddleware");

const AdviceController = require("../controllers/advice.controller");
const adviceController = new AdviceController();

//조언 게시글 업로드
adviceRouter.post(
  "/",
  authMiddleware,
  uploadadvice.array("image", 3),
  adviceController.creatAdvice
);

//조언 게시글 조회
adviceRouter.get(
  "/category/:categoryId",
  authMiddleware,
  adviceController.allAdvice
);

//조언 게시글 상세조회
adviceRouter.get("/:adviceId", authMiddleware, adviceController.findOneAdvice);

//내가 쓴 조언글 조회
adviceRouter.get("/mypage/advice", authMiddleware, adviceController.myadvice);

//조언 게시글 수정
adviceRouter.put(
  "/:adviceId",
  authMiddleware,
  uploadadvice.array("image", 3),
  adviceController.updateAdvice
);




module.exports = adviceRouter;
