const AdviceRepository = require("../repositories/advice.rpository");

class AdviceService {
    adviceRepository = new AdviceRepository();
    
    createAdvice = async (userKey, title, categoryId, content) => {
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