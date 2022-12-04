const { Router } = require("express");
const adviceRouter = Router();
const uploadadvice = require("../modules/advice.multer");

const auth = require("../middlewares/authMiddleware");
const reward = require("../middlewares/rewardMiddleware");

const AdviceController = require("../controllers/advice.controller");
const adviceController = new AdviceController();

//조언 게시글 업로드
adviceRouter.post(
  "/",
  auth,
  uploadadvice.array("image", 3),
  adviceController.creatAdvice,
  reward
);

//조언 게시글 조회
adviceRouter.get(
  "/category/:categoryId/:filterId",
  auth,
  adviceController.allAdvice
);

//조언 게시글 상세조회

adviceRouter.get("/:adviceId/:filterId", auth, adviceController.findOneAdvice);

//조언 게시글 수정
adviceRouter.put(
  "/:adviceId",
  auth,
  uploadadvice.array("image", 3),
  adviceController.updateAdvice
);

module.exports = adviceRouter;
