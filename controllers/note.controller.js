const { SchemaTextFieldPhonetics } = require("redis");
const NoteService = require("../services/note.service");


class NoteController {
  noteService = new NoteService()

  // 쪽지 등록
  creatNote = async (req, res, next) => {
    const { userKey:fUser } = res.locals.user;
    const { userKey:tUser } = req.params;
    const { note } = req.body;
    try {
      const creatNote = await this.noteService.createNote(
        tUser,
        fUser,
        note
      );
      console.log(creatNote)

      res.status(200).json({
        msg: "쪽지 전달 완료",
      });
    } catch (error) {
      next(error);
    }
  };

  // 쪽지 목록 페이지
  allMyNote = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const myNotePage = await this.noteService.allMyNote(userKey);
    // const test = myNotePage.map((x) => x.recipient)
    // console.log(test, "나오나")

    try {
      return res.status(200).json({ myNotePage });
    } catch(err) {
      next(err);
    }    
  }

  // 보낸 쪽지 상세 페이지
  findNoteOne = async (req, res, next) => {
    const { userKey } = res.locals.user; 
    const { noteId } = req.params;

    const findNoteOne = await this.noteService.findNoteOne(noteId, userKey);

    try {
      return res.status(200).json({findNoteOne})
    }catch(err) {
      next(err)
    }
  }

      
}

module.exports = NoteController;