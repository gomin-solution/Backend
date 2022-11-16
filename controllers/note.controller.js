const NoteService = require("../services/note.service");


class NoteController {
  noteService = new NoteService()


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

  allMyNote = async (req, res, next) => {
    const { userKey } = res.locals.user;
    const allMyNote = await this.noteService.allMyNote(userKey);
    console.log(userKey, "이건 어떤가?")
    console.log(allMyNote, "나오나")

    try {
      return res.status(200).json({ allMyNote });
    } catch(err) {
      next(err);
    }

    
  }
      
}

module.exports = NoteController;