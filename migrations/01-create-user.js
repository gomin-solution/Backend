"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      userKey: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      nickname: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      isAdult: {
        allowNull: true,
        type: Sequelize.BOOLEAN,
      },
      userImg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      grade: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("Users");
  },
};
