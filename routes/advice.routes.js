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
  "/category/:categoryId/:filterId",
  authMiddleware,
  adviceController.allAdvice
);

//조언 게시글 상세조회

adviceRouter.get(
  "/:adviceId/:filterId",
  authMiddleware,
  adviceController.findOneAdvice
);

//조언 게시글 수정
adviceRouter.put(
  "/:adviceId",
  authMiddleware,
  uploadadvice.array("image", 3),
  adviceController.updateAdvice
);

// 조언 게시글 신고
adviceRouter.put(
  "/report/:adviceId",
  authMiddleware,
  adviceController.reportAdvice
);



module.exports = adviceRouter;
