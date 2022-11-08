"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("isChoice", {
      userKey: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: "Users",
            key: "userKey",
        },
      },
      commentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: "Comment",
            key: "commentId",
        },
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
    await queryInterface.dropTable("isChoice");
  },
};
