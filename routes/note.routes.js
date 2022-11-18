const { Router } = require("express");
const noteRouter = Router();


const authMiddleware = require("../middlewares/authMiddleware");

const NoteController = require('../controllers/note.controller');
const noteController = new NoteController;

// 쪽지 보내기
noteRouter.post("/:userKey", authMiddleware, noteController.creatNote);

// 쪽지함 조회
noteRouter.get("/", authMiddleware, noteController.allMyNote);

//쪽지 상세페이지
noteRouter.get("/:noteId", authMiddleware, noteController.findNoteOne);

// 쪽지 삭제
noteRouter.delete("/:noteId", authMiddleware, noteController.deleteNote);


module.exports = noteRouter;