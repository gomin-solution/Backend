const { SchemaTextFieldPhonetics } = require("redis");
const NoteService = require("../services/note.service");

class NoteController {
  noteService = new NoteService();

  // 쪽지 등록
  createroom = async (req, res, next) => {
    try {
      const { userKey: fUser } = res.locals.user;
      const { userKey: tUser, title, category, note } = req.body;

      const creatRoom = await this.noteService.createNoteRoom(
        tUser,
        fUser,
        title,
        category
      );

      const roomId = creatRoom.roomId;
      res.status(200).json({ roomId });
    } catch (error) {
      next(error);
    }
  };

  roomlist = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const roomlist = await this.noteService.allRooms(userKey);

      return res.status(200).json(roomlist);
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
      return res.status(200).json({ myNotePage });
    } catch (err) {
      next(err);
    }
  };

  // 보낸 쪽지 상세 페이지
  roadNotes = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { roomId } = req.params;

      const { notes, nickname } = await this.noteService.roadNotes(
        roomId,
        userKey
      );
      return res.status(200).json({ notes: notes, nickname: nickname });
    } catch (err) {
      next(err);
    }
  };

  deleteNote = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const { noteId } = req.params;
    try {
      const myNotePage = await this.noteService.findNoteOne(noteId, userKey);

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
