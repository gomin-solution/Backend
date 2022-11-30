"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AdviceBMs", {
      adviceBMId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      adviceId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Advice",
          key: "adviceId",
        },
        onDelete: "cascade",
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
    await queryInterface.dropTable("AdviceBMs");
  },
};
