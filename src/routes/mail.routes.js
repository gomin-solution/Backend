const { Router } = require("express");
const mailRouter = Router();

const MailController = require("../controllers/mail.controller");
const mailController = new MailController();

mailRouter.post("/", mailController.temporaryPassword);

module.exports = mailRouter;
