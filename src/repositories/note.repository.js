const { Note, User, NoteRoom } = require("../models");
const { Op } = require("sequelize");

class NoteRepository {
  createNoteRoom = async (tUser, fUser, title, category) => {
    const Title = `[${category}]${title}`;
    const [createNoteRoom, create] = await NoteRoom.findOrCreate({
      where: {
        user1: tUser,
        user2: fUser,
        title: Title,
      },
      defaults: {
        user1: tUser,
        user2: fUser,
        title: Title,
      },
    });
    console.log(createNoteRoom.roomId);
    return createNoteRoom;
  };

  allRooms = async (userKey) => {
    const allRooms = await NoteRoom.findAll({
      where: { [Op.or]: [{ user1: userKey }, { user2: userKey }] },
      include: [
        { model: User, as: "User1", attributes: ["nickname", "userKey"] },
        { model: User, as: "User2", attributes: ["nickname", "userKey"] },
        { model: Note, order: [["createdAt", "DESC"]], limit: 1 },
      ],
      order: [["createdAt", "DESC"]],
    });

    return allRooms;
  };

  allMyNote = async (userKey) => {
    const allMyNote = await Note.findAll({
      where: { [Op.or]: [{ tUser: userKey }, { fUser: userKey }] },
    });
    // // 보낸 쪽지
    // const toMyNote = await Note.findAll({ where: {tUser: userKey}});
    // // 받은 쪽지
    // const fromMyNote = await Note.findAll({ where: {fUser: userKey} });
    // const allMyNote = toMyNote.concat(fromMyNote).sort((a,b) => b.createdAt - a.createdAt)
    // console.log(allMyNote, "이건그냥 이어붙인 것")

    return allMyNote;
  };

  roadNotes = async (roomId) => {
    const findallNote = await Note.findAll({
      order: [["createdAt", "ASC"]],
      where: { roomId: roomId },
      include: [
        {
          model: NoteRoom,
          include: [
            { model: User, as: "User1" },
            { model: User, as: "User2" },
          ],
        },
      ],
    });
    //console.log(findNoteOne, "이건 안나오나?");

    return findallNote;
  };
  sendNote = async (note, roomId, userKey) => {
    await Note.create({ note: note, roomId: roomId, userKey: userKey });
  };
  //쪽지방 삭제(찾기용)
  findRoom = async (roomId, user1) => {
    let data = await NoteRoom.findOne({
      where: {
        [Op.and]: [{ roomId }, { user1: user1 }],
      },
    });

    if (!data) {
      data = await NoteRoom.findOne({
        where: {
          [Op.and]: [{ roomId }, { user2: user1 }],
        },
      });
    }

    return data;
  };

  //쪽지방 삭제
  deleteRoom = async (roomId, userKey) => {
    const data = await NoteRoom.destroy({
      where: {
        [Op.and]: [{ roomId }],
      },
    });

    return data;
  };
}

module.exports = NoteRepository;
