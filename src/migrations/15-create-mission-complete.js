"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MissionCompletes", {
      missionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Missions",
          key: "missionId",
        },
      },
      userKey: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
      isGet: {
        type: Sequelize.BOOLEAN,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("MissionCompletes");
  },
};
