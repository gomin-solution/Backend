const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const LoginMiddleware = require("../middlewares/LoginMiddleware");
const LogoutMiddleware = require("../middlewares/LogoutMiddleware");
const UserController = require("../controllers/user.controller");
const userController = new UserController();
const reward = require("../middlewares/rewardMiddleware");

const AdviceController = require("../controllers/advice.controller");
const adviceController = new AdviceController();

//메인페이지
router.get("/", auth, userController.mainPage);

//행운의편지 메세지 열기
router.put("/msg", auth, userController.dailyMessage, reward);

//회원가입
router.post("/signup", LoginMiddleware, userController.signup);

//비밀번호 변경
router.put("/password", auth, userController.passwordChange);

//중복검사
router.post("/signup/check", userController.check);

//로그인
router.post("/login", LoginMiddleware, userController.login);

//닉네임 변경
router.put("/nickname", auth, userController.nicknameChange);

//카카오 로그인
router.post("/kakao", LoginMiddleware, userController.kakao);

//로그아웃
router.delete("/logout", LogoutMiddleware);

//로그인테스트
router.post("/test", auth);

//설정 페이지(관리자 인경우 신고 리스트 보내기)
router.get("/setting", auth, userController.setting);

//내가 쓴 글 조회
router.get("/mypost", auth, userController.myPost);

//검색
router.get("/search/:keyword", auth, userController.search);

//검색 페이지
router.get("/search", auth, userController.searchPage);
//리워드
router.get("/reword", auth, userController.reword);

//조언 게시글 삭제
router.delete("/advice/:adviceId", auth, adviceController.deleteAdvice);

//회원탈퇴
router.put("/bye", auth, userController.bye);

//리워드
router.put("/reword/:missionId", auth, userController.getReword);

module.exports = router;
