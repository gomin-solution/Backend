"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Choices", {
      choiceId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userKey: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      choice1Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      choice2Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      choice1Per: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      choice2Per: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      choiceCount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
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
    await queryInterface.dropTable("Choices");
  },
};
