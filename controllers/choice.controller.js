
const ChoiceService = require('../services/choice.service');

class ChoiceController {
    choiceService = new ChoiceService();

    createchoice = async (req, res, next) =>{
        try{
            const { userKey } = res.locals.user;
            const {title, choice1Name, choice2Name, endTime} = req.body;

            if (!title || !choice1Name || !choice2Name || !endTime){
                res.status(400).send({errorMessage: '모든 내용을 입력해 주세요'});
                return;
            }

            const createchoice = await this.choiceService.createchoice(userKey, title, choice1Name, choice2Name, endTime)
            res.status(201).send({data: createchoice});  

        }catch(err){
            next(err);
        }

    }


    allchoice = async (req, res, next) => {
        try {
        const allchoice = await this.choiceService.findAllchoice();
        res.status(200).json({ data: allchoice });
        } catch (err) {
        next(err);
        }
    }

    mychoice = async (req, res, next) =>{
        try{
            const {userKey} = res.locals.user;
            const mychoice = await this.choiceService.findMychoice(userKey);
            res.status(200).json({data: mychoice});
        }catch(err){
            next(err);
        }
    }

    deletechoice = async (req, res, next) =>{
        try{
            const {userKey} = res.locals.user;
            const {choiceId} = req.params;
            if(!choiceId) throw new Error("없는 게시글 입니다.")

            const deletechoice = await this.choiceService.deletechoice(userKey, choiceId);
            res.status(200).json({data: deletechoice});
        }catch(err){
            next(err);
        }
    }

    choice = async (req, res, next) =>{
        try{
            const {userKey} = res.locals.user;
            const {choiceId} = req.params;
            const {choiceNum} = req.body;
            let choice
            if(!choiceId)throw new Error("없는 게시글 입니다.")
            if(choiceNum === 1 || choiceNum === 2){
                 choice = await this.choiceService.choice(userKey, choiceId, choiceNum);
            }else{
                throw new Error("잘못된 접근 입니다.")
            }
            res.status(200).json({message: '투표 성공'});
            return choice
        }
        catch(err){
            next(err);
        }
    }

}

module.exports = ChoiceController;
