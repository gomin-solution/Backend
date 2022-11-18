const { Note, User } = require("../models");
const { Op } = require("sequelize");

class NoteRepository {
  createNote = async (tUser, fUser, note) => {
    const createNoteData = await Note.create({
      tUser,
      fUser,
      note,
    });
    console.log(createNoteData);
    return createNoteData;
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

  findNoteOne = async (noteId, userKey) => {
    const findNoteOne = await Note.findOne({
      where: { noteId, [Op.or]: [{ tUser: userKey }, { fUser: userKey }] },
      include: [
        { model: User, as: "fUserData", attributes: ["nickname", "userImg"] },
        { model: User, as: "tUserData", attributes: ["nickname", "userImg"] },
      ],
    });
    //console.log(findNoteOne, "이건 안나오나?");

    return findNoteOne;
  };

  deleteNote = async (noteId, userKey) => {
   return await Note.destroy({ where: { noteId, fUser:userKey } });
  }
}

module.exports = NoteRepository;
