const express = require('express');
const router = express.Router();

const VoteController = require('./vote.controller');

const voteController = new VoteController;

router.post('/', voteController.createVote);
router.get('/choice', voteController.allVote);
router.get('/mypage/choice', voteController.myVote);
router.delete;('/mypage/choice/:choiceId', voteController.deleteVote);

module.exports = router;

