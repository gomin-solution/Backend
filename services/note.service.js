const NoteRepository = require("../repositories/note.repository");

class NoteService {
    noteRepository = new NoteRepository()

    createNote = async (tUser, fUser, note) => {
        const createNote = await this.noteRepository.createNote(
            tUser, fUser, note
        );
        return createNote;
    };

    allMyNote = async (userKey) => {
        const allMyNote = await this.noteRepository.allMyNote(userKey);

        return allMyNote;
    }
}

module.exports = NoteService;