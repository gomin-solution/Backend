const { Router } = require("express");
const adviceRouter = Router();
const upload = require("../modules/advice.multer");

const authMiddleware = require("../middlewares/authMiddleware");

const AdviceController = require("../controllers/advice.controller");
const adviceController = new AdviceController();
const AdviceImageController = require("../controllers/adviceimage.controller")
const adviceImageController = new AdviceImageController();

//조언 게시글 업로드
adviceRouter.post("/", authMiddleware, adviceController.creatAdvice);

//조언 이미지 업로드
adviceRouter.post("/:adviceId", upload.array("image", 5), adviceImageController.creatAdviceImage);
module.exports = adviceRouter;
