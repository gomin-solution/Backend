const { SchemaTextFieldPhonetics } = require("redis");
const NoteService = require("../services/note.service");

class NoteController {
  noteService = new NoteService();

  // 쪽지 등록
  creatNote = async (req, res, next) => {
    const { userKey: fUser } = res.locals.user;
    const { userKey: tUser } = req.params;
    const { note } = req.body;
    try {
      const creatNote = await this.noteService.createNote(tUser, fUser, note);
      console.log(creatNote);

      res.status(200).json({ msg: "쪽지 전달 완료" });
    } catch (error) {
      next(error);
    }
  };

  // 쪽지 목록 페이지
  allMyNote = async (req, res, next) => {
    const { userKey } = res.locals.user;

    try {
      const myNotePage = await this.noteService.allMyNote(userKey);
      // const test = myNotePage.map((x) => x.recipient)
      // console.log(test, "나오나")
      return res.status(200).json({ myNotePage });
    } catch (err) {
      next(err);
    }
  };

  // 보낸 쪽지 상세 페이지
  findNoteOne = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { noteId } = req.params;

    

    try {
      const findNoteOne = await this.noteService.findNoteOne(noteId, userKey);
      return res.status(200).json({ findNoteOne });
    } catch (err) {
      next(err);
    }
  };

  deleteNote = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { noteId } = req.params;
    try {
      const myNotePage = await this.noteService.findNoteOne(noteId, userKey);
      //console.log(myNotePage.fUser, "쪽지 찾기")

      if (userKey !== myNotePage.fUser) {
        return res.status(400).send({ message: "권한이 없습니다." });
      }
      await this.noteService.deleteNote(noteId, userKey);

      return res.status(200).send({ message: "삭제 완료" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = NoteController;
