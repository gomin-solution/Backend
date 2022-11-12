"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MissonCompletes", {
      missonId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Missons",
          key: "missonId",
        },
      },
      userKey: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MissonCompletes");
  },
};
