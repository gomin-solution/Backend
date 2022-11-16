const { Note, User } = require("../models");

class NoteRepository {

    createNote = async (tUser, fUser, note) => {
        const createNoteData = await Note.create({
            tUser, fUser, note
        });
        console.log(createNoteData)
        return createNoteData;
    };

    allMyNote = async (userKey) => {
        const allMyNote = await Note.findAll({where: {userKey}});
        //     {
        //     where: {userKey:tUser},
        //     order: [["createdAt", "DESC"]], // 오름차순: ASC, 내림차순 : DESC
        //     include: [
        //       { model: tUser, attributes: ["nickname", "userImg"] },
        //       { model: fUser, attributes: ["nickname", "userImg"] },
        //       {Note}
        //     ],
        //   });
        console.log(allMyNote, "이건 아무것도 안나오나..")
        return allMyNote;
    }

}

module.exports = NoteRepository;