const express = require("express");
const router = express.Router();

const auth = require("../middlewares/authMiddleware");
<<<<<<< HEAD
=======
const reward = require("../middlewares/rewardMiddleware");
>>>>>>> fcaab6d0eb1946b91ddc0eca3e92d67e55afc40a

const ChoiceController = require("../controllers/choice.controller");
const choiceController = new ChoiceController();

//투표 게시글 만들기
<<<<<<< HEAD
router.post("/choice", auth, choiceController.createchoice);
=======
router.post("/choice", auth, choiceController.createchoice, reward);
>>>>>>> fcaab6d0eb1946b91ddc0eca3e92d67e55afc40a

//모든 투표 게시글 가져오기
router.get("/choice/:sort", auth, choiceController.allchoice);

//투표 선택
<<<<<<< HEAD
router.put("/choice/:choiceId", auth, choiceController.choice);
=======
router.put("/choice/:choiceId", auth, choiceController.choice, reward);
>>>>>>> fcaab6d0eb1946b91ddc0eca3e92d67e55afc40a

//조기마감
router.put("/choice/early/:choiceId", auth, choiceController.early);

//마이페이지에서 내가 작성한 투표 게시글 삭제
router.delete("/choice/:choiceId", auth, choiceController.deletechoice);

// router.put("/choice/:choiceId", auth, choiceController.endChoice);

module.exports = router;
