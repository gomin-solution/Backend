const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const ChoiceController = require("../controllers/choice.controller");
const choiceController = new ChoiceController();

//투표 게시글 만들기
router.post("/choice", authMiddleware, choiceController.createchoice);

//모든 투표 게시글 가져오기

router.get("/choice/:sort", authMiddleware, choiceController.allchoice);


//투표 선택
router.put("/choice/:choiceId", authMiddleware, choiceController.choice);

//마이페이지에서 내가 작성한 투표 게시글 가져오기
router.get("/mypage/choice", authMiddleware, choiceController.mychoice);

//조기마감
router.put("/choice/early/:choiceId", authMiddleware, choiceController.early);

//마이페이지에서 내가 작성한 투표 게시글 삭제
router.delete(
  "/choice/:choiceId",
  authMiddleware,
  choiceController.deletechoice
);

// router.put("/choice/:choiceId", authMiddleware, choiceController.endChoice);

module.exports = router;
