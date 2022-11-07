const VoteService = require('./vote.service');

class VoteController {
    voteService = new VoteService();

    createVote = async (req, res, next) =>{
        try{
            const {userId} = req.params.user;
            const {title, choice1Name, choice2Name, endTime} = req.body;

            if (!title || !choice1Name || !choice2Name || !endTime){
                res.status(400).send({errorMessage: '모든 내용을 입력해 주세요'});
                return;
            }

            const createVote = await this.voteService.createVote(title, choice1Name, choice2Name, endTime)
            res.status(201).send({data: createVote});  

        }catch(err){
            next(err);
        }

    }

    allVote = async (req, res, next) =>{
        try{
            const allVote = await this.voteService.findAllVote();
            res.status(200).json({data:allVote});

        }catch(err){
            next(err);
        }
    }

    myVote = async (req, res, next) =>{
        try{
            const {userId} = req.params.user;
            const myVote = await this.voteService.findMyVote(userId);
            res.status(200).json({data: myVote});
        }catch(err){
            next(err);
        }
    }

    deleteVote = async (req, res, next) =>{
        try{
            const {userId} = req.params.user;
            const {choiceId} = req.params;
            if(!userId) throw new Error("없는 게시글 입니다.")

            const deleteVote = await this.voteService.deleteVote(userId, choiceId);
            res.status(200).json({data: deleteVote});
        }catch(err){
            next(err);
        }
    }


}

module.exports = VoteController;