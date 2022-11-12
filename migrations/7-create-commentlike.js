"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CommentLikes", {
      id: {
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
      commentId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
            model: "Comments",
            key: "commentId",
        },
        onDelete: 'cascade',
      },
      // choiceId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      //   references: {
      //       model: "Choices",
      //       key: "choiceId",
      //   },
      // },
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
    await queryInterface.dropTable("CommentLikes");
  },
};
