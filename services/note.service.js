const { DocDB } = require("aws-sdk");
const NoteRepository = require("../repositories/note.repository");

class NoteService {
  noteRepository = new NoteRepository();

  createNote = async (tUser, fUser, note) => {
    const createNote = await this.noteRepository.createNote(tUser, fUser, note);
    return createNote;
  };

  allMyNote = async (userKey) => {
    const allMyNote = await this.noteRepository.allMyNote(userKey);
    const myNotePage = allMyNote.map((note) => {
      let isMe;
      note.fUser == userKey ? (isMe = true) : (isMe = false);
      return {
        noteId: note.noteId,
        sender: note.fUser,
        recipient: note.tUser,
        note: note.note,
        isMe: isMe,
      };
    });

    return myNotePage;
  };

  findNoteOne = async (noteId, userKey) => {
    const findNoteOne = await this.noteRepository.findNoteOne(noteId, userKey);
      return {
        noteId: findNoteOne.noteId,
        fUser: findNoteOne.fUser,
        fUserNickname: findNoteOne.fUserData.nickname,
        fUserImg: findNoteOne.fUserData.userImg,
        tUser: findNoteOne.tUser,
        tUserNickname: findNoteOne.tUserData.nickname,
        tUserImg: findNoteOne.tUserData.userImg,
        note: findNoteOne.note,
      };
  };
}

module.exports = NoteService;
