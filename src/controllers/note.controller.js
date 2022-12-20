const NoteService = require("../services/note.service");

class NoteController {
  noteService = new NoteService();

  /**쪽지방 생성 */
  createroom = async (req, res, next) => {
    try {
      const { userKey: fUser } = res.locals.user;
      const { userKey: tUser, title, category, note } = req.body;

      //쪽지 생성하고 방만들기
      await this.noteService.createNoteRoom(
        tUser,
        fUser,
        title,
        category,
        note
      );
      res.status(200).json({ message: "쪽지 전송 완료" });
    } catch (error) {
      next(error);
    }
  };

  /**쪽지방 리스트 조회 */
  roomlist = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;

      if (userKey == 0) {
        return res.status(400).send({ message: "로그인이 필요합니다." });
      }

      const roomlist = await this.noteService.allRooms(userKey);

      return res.status(200).json(roomlist);
    } catch (error) {
      next(error);
    }
  };

  /**쪽지함 조회 */
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

  /**쪽지방 삭제 */
  deleteRoom = async (req, res, next) => {
    try {
      const { userKey } = res.locals.user;
      const { roomId } = req.params;
      const deleteRoom = await this.noteService.deleteRoom(roomId, userKey);

      if (!deleteRoom) {
        return res.status(400).send({ message: "없는 방입니다." });
      }

      if (!deleteRoom) {
        return res.status(400).send({ message: "권한없음" });
      }

      return res.status(200).send({ message: "삭제 완료" });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = NoteController;
