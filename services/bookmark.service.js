const BookMarkRepository = require("../repositories/bookmark.repository");

class BookMarkService {
  bookmarkRepository = new BookMarkRepository();

  updateChoiceBM = async (userKey, choiceId) => {
    await this.bookmarkRepository.addBookmark;

    await this.bookmarkRepository.cancelBookmark;
  };
}

module.exports = BookMarkService;
