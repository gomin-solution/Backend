const Joi = require("joi");
const ErrorCustom = require("../exceptions/error-custom");

module.exports = {
  signupSchema: Joi.object({
    userId: Joi.string()
      .pattern(new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,10}$"))
      .required()
      .error(new ErrorCustom(400, "아이디 형식은 영문 숫자 4자 이상 입니다")),

    nickname: Joi.string()
      .pattern(new RegExp("^[가-힣a-zA-z0-9]{1,8}$"))
      .required()
      .error(
        new ErrorCustom(400, "닉네임은 영문 숫자 한글 8자 이내여야 합니다.")
      ),

    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
        )
      )
      .required()
      .error(
        new ErrorCustom(
          400,
          "비밀번호 영문 숫자 특수문자 포함 8자 이상이여야 됩니다."
        )
      ),
    confirm: Joi.ref("password"),

    isAdult: Joi.string(),
  }),

  loginSchema: Joi.object({
    userId: Joi.string()
      .pattern(new RegExp("^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,10}$"))
      .required()
      .error(new ErrorCustom(400, "아이디 형식을 확인해 주세요")),

    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
        )
      )
      .required()
      .error(new ErrorCustom(400, "비밀번호는 최소 8자 이상이어야 합니다.")),
  }),
};
