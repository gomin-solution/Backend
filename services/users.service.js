const { ErrorCustom } = require("../exceptions/error-custom");
const UserRepository = require("../repositories/users.repository.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UserService {
  userRepository = new UserRepository();

  createUser = async () => {};

  verifyUser = async () => {};
}

module.exports = UserService;
