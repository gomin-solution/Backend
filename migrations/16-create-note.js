"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Notes", {
      noteId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fUser: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
      tUser: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
      note: {
        type: Sequelize.STRING,
      },
      isMe: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Notes");
  },
};
