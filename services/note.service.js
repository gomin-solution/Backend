const NoteRepository = require("../repositories/note.repository");

const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

class NoteService {
  noteRepository = new NoteRepository();

  createNote = async (tUser, fUser, title, category) => {
    const createNote = await this.noteRepository.createNote(
      tUser,
      fUser,
      title,
      category
    );
    return createNote;
  };

  allRooms = async (userKey) => {
    const allRooms = await this.noteRepository.allRooms(userKey);

    const rooms = allRooms.map((room) => {
      let nickname;
      let recentDate;
      room.User1.userKey == userKey
        ? (nickname = room.User2.nickname)
        : (nickname = room.User1.nickname);

      room.Notes.length
        ? (recentDate = room.Notes.createdAt)
        : (recentDate = room.createdAt);
      const date = dayjs(recentDate).tz().format("YYYY.MM.DD HH:mm");
      return {
        roomId: room.roomId,
        title: room.title,
        nickname: nickname,
        recentDate: date,
      };
    });

    return rooms;
  };

  allMyNote = async (userKey) => {
    const allMyNote = await this.noteRepository.allMyNote(userKey);
    const myNotePage = allMyNote.map((note) => {
      let isMe;
      note.fUser == userKey ? (isMe = true) : (isMe = false);
      return {
        noteId: note.noteId,
        fUser: note.fUser, //보낸이
        tUser: note.tUser, //빋는이
        note: note.note,
        isMe: isMe,
      };
    });

    return myNotePage;
  };

  roadNotes = async (roomId, userKey) => {
    const roadNotes = await this.noteRepository.roadNotes(roomId, userKey);
    return {
      noteId: roadNotes.noteId,
      fUser: roadNotes.fUser,
      fUserNickname: roadNotes.fUserData.nickname,
      fUserImg: roadNotes.fUserData.userImg,
      tUser: roadNotes.tUser,
      tUserNickname: roadNotes.tUserData.nickname,
      tUserImg: roadNotes.tUserData.userImg,
      note: roadNotes.note,
    };
  };

  deleteNote = async (noteId, userKey) => {
    const deleteNote = await this.noteRepository.deleteNote(noteId, userKey);
    return deleteNote;
  };
}

module.exports = NoteService;
