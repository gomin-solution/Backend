const AdviceRepository = require("../repositories/advice.rpository");

class AdviceService {
    adviceRepository = new AdviceRepository();
    
    createAdvice = async (userKey, adviceId, imageUrl) => {
        const createAdviceData = await this.adviceRepository.createAdvice(
            userKey,
            adviceId,
            imageUrl
        );
        return createAdviceData;
    }
}

module.exports = AdviceService;