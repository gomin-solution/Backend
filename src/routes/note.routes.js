const { Router } = require("express");
const noteRouter = Router();

const auth = require("../middlewares/authMiddleware");

const NoteController = require("../controllers/note.controller");

const noteController = new NoteController();

// 쪽지 보내기
noteRouter.post("/rooms", auth, noteController.createroom);

//대화내용 불러오기
noteRouter.get("/rooms/:roomId", auth, noteController.roadNotes);

// 쪽지방 목록 조회
noteRouter.get("/rooms", auth, noteController.roomlist);

// // 쪽지함 조회
// noteRouter.get("/", auth, noteController.allMyNote);

//쪽지방 삭제=======
noteRouter.delete("/rooms/:roomId", auth, noteController.deleteRoom);

module.exports = noteRouter;
