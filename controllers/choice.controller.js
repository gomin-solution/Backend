const ChoiceService = require('../services/Choice.service');

class ChoiceController {
    choiceService = new ChoiceService();

    createchoice = async (req, res, next) =>{
        try{
            const {userId} = req.params.user;
            const {title, choice1Name, choice2Name, endTime} = req.body;

            if (!title || !choice1Name || !choice2Name || !endTime){
                res.status(400).send({errorMessage: '모든 내용을 입력해 주세요'});
                return;
            }

            const createchoice = await this.choiceService.createchoice(title, choice1Name, choice2Name, endTime)
            res.status(201).send({data: createchoice});  

        }catch(err){
            next(err);
        }

    }

    allchoice = async (req, res, next) =>{
        try{
            const allchoice = await this.choiceService.findAllchoice();
            res.status(200).json({data:allchoice});

        }catch(err){
            next(err);
        }
    }

    mychoice = async (req, res, next) =>{
        try{
            const {userId} = req.params.user;
            const mychoice = await this.choiceService.findMychoice(userId);
            res.status(200).json({data: mychoice});
        }catch(err){
            next(err);
        }
    }

    deletechoice = async (req, res, next) =>{
        try{
            const {userId} = req.params.user;
            const {choiceId} = req.params;
            if(!userId) throw new Error("없는 게시글 입니다.")

            const deletechoice = await this.choiceService.deletechoice(userId, choiceId);
            res.status(200).json({data: deletechoice});
        }catch(err){
            next(err);
        }
    }

    choice = async (req, res, next) =>{
        try{
            const {userId} = req.params.user;
            const {choiceId} = req.params;
            const {choiceNum} = req.body;
            if(!choiceId)throw new Error("없는 게시글 입니다.")
            if(choiceNum === 1 || choiceNum ===2){
                 const choice = await this.choiceService.choice(userId, choiceId, choiceNum);
            }else{
                throw new Error("잘못된 접근 입니다.")
            }

            res.status(200).json({message: '투표 성공'});


        }
        catch(err){
            next(err);
        }
    }


}

module.exports = ChoiceController;