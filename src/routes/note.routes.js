const { Router } = require("express");
const noteRouter = Router();

const authMiddleware = require("../middlewares/authMiddleware");

const NoteController = require("../controllers/note.controller");

const noteController = new NoteController();

// 쪽지 보내기
noteRouter.post("/rooms", authMiddleware, noteController.createroom);

//대화내용 불러오기
noteRouter.get("/rooms/:roomId", authMiddleware, noteController.roadNotes);

// 쪽지방 목록 조회
noteRouter.get("/rooms", authMiddleware, noteController.roomlist);

// // 쪽지함 조회
// noteRouter.get("/", authMiddleware, noteController.allMyNote);

//쪽지 상세페이지

//쪽지방 삭제=======
noteRouter.delete("/rooms/:roomId", authMiddleware, noteController.deleteRoom);

module.exports = noteRouter;