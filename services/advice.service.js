const AdviceRepository = require("../repositories/advice.rpository");

class AdviceService {
    adviceRepository = new AdviceRepository();
    
    createAdvice = async (userKey, title, categoryId, content, imageUrl1, imageUrl2) => {
        const createAdviceData = await this.adviceRepository.createAdvice(
            userKey,
            title,
            categoryId,
            content,
        );
        return createAdviceData;
    }
}

module.exports = AdviceService;