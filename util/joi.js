const Joi = require("joi");
const ErrorCustom = require("../exceptions/error-custom");

module.exports = {
  signupSchema: Joi.object({
    username: Joi.string()
      .alphanum()
      .min(4)
      .max(10)
      .required()
      .error(new ErrorCustom(400, "아이디 형식을 확인해 주세요")),

    nickname: Joi.string()
      .min(1)
      .max(8)
      .required()
      .error(
        new ErrorCustom(400, "닉네임은 한글, 영문, 숫자 8자 이내여야 합니다.")
      ),
    password: Joi.string()
      .min(8)
      .max(20)
      .required()
      .error(new ErrorCustom(400, "비밀번호는 최소 8자 이상이어야 합니다.")),
  }),

  loginSchema: Joi.object({
    username: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: false } })
      .required()
      .error(new ErrorCustom(400, "올바른 이메일 형식이 아닙니다.")),
    password: Joi.string()
      .min(4)
      .required()
      .error(new ErrorCustom(400, "닉네임 또는 패스워드를 확인해주세요.")),
  }),
};
