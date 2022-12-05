"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserActivities", {
      userKey: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "userKey",
        },
      },
      commentCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      choiceCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      postAdviceCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      postChoiceCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      receiveLikeCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      msgOpenCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      selectCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      choiceEndCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserActivities");
  },
};
