const Joi = require("joi");
const ErrorCustom = require("../exceptions/error-custom");

module.exports = {
  signupSchema: Joi.object({
    userId: Joi.string()
      .alphanum()
      .min(4)
      .max(10)
      .required()
      .error(new ErrorCustom(400, "아이디 형식을 확인해 주세요")),

    nickname: Joi.string()
      .pattern(new RegExp("^[가-힣a-zA-Z0-9]+$"))
      .min(1)
      .max(8)
      .required()
      .error(new ErrorCustom(400, "닉네임은 8자 이내여야 합니다.")),

    password: Joi.string()
      .min(8)
      .max(20)
      .required()
      .error(new ErrorCustom(400, "비밀번호는 최소 8자 이상이어야 합니다.")),
  }),

  loginSchema: Joi.object({
    userId: Joi.string().alphanum().min(4).max(10).required(),

    password: Joi.string().min(8).max(20).required(),
  }),
};
