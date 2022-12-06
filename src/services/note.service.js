const NoteRepository = require("../repositories/note.repository");
const ErrorCustom = require("../exceptions/error-custom");

const dayjs = require("dayjs");
const timezone = require("dayjs/plugin/timezone");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");

class NoteService {
  noteRepository = new NoteRepository();

  //방 생성
  createNoteRoom = async (tUser, fUser, title, category, note) => {
    const createNote = await this.noteRepository.createNoteRoom(
      tUser,
      fUser,
      title,
      category
    );
    //쪽지 생성
    await this.noteRepository.sendNote(note, createNote.roomId, fUser);
    return createNote;
  };

  allRooms = async (userKey) => {
    const allRooms = await this.noteRepository.allRooms(userKey);

    const rooms = allRooms.map((room) => {
      let nickname;

      room.User1.userKey == userKey
        ? (nickname = room.User2.nickname)
        : (nickname = room.User1.nickname);

      const recentDate = room.Notes.createdAt;
      console.log("//////////recentDate/////////////");
      console.log(recentDate);

      const date = dayjs(recentDate).tz().format("YYYY/MM/DD HH:mm");
      console.log("///////////date///////////");
      console.log(date);
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
    const roadNotes = await this.noteRepository.roadNotes(roomId);
    //대화상대 닉네임
    let nickname;
    roadNotes[0]?.user1 !== userKey
      ? (nickname = roadNotes[0]?.NoteRoom.User2.nickname)
      : (nickname = roadNotes[0]?.NoteRoom.User1.nickname);
    const notes = roadNotes?.map((note) => {
      const date = dayjs(note.createdAt).tz().format("YYYY/MM/DD HH:mm");
      return {
        userKey: note.userKey,
        note: note.note,
        date: date,
      };
    });

    return { notes, nickname };
  };

  //쪽지방 삭제
  deleteRoom = async (roomId, userKey) => {
    const findRoom = await this.noteRepository.findRoom(roomId, userKey);

    if (!findRoom) {
      throw new ErrorCustom(400, "권한이 없습니다");
    }

    const deleteNote = await this.noteRepository.deleteRoom(roomId, userKey);
    return deleteNote;
  };
}

module.exports = NoteService;
