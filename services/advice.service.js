const AdviceRepository = require("../repositories/advice.rpository");

class AdviceService {
    adviceRepository = new AdviceRepository();
    
    createAdvice = async (userId, title, categoryId, content, imageUrl1, imageUrl2) => {
        const createAdviceData = await this.adviceRepository.createAdvice(
            userId,
            title,
            categoryId,
            content,
            imageUrl1,
            imageUrl2
        );
        return createAdviceData;
    }
}

module.exports = AdviceService;