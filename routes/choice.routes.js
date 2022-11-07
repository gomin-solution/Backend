const express = require('express');
const router = express.Router();

const ChoiceController = require('./choice.controller');

const choiceController = new ChoiceController;

router.post('/', choiceController.createchoice);
router.get('/choice', choiceController.allchoice);
router.get('/mypage/choice', choiceController.mychoice);
router.delete;('/mypage/choice/:choiceId', choiceController.deletechoice);

module.exports = router;

