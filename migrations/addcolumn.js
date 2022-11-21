"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return await queryInterface.createTable("isChoices", {
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
      choiceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Choices",
          key: "choiceId",
        },
        onDelete: "cascade",
      },
      choiceNum: {
        type: Sequelize.INTEGER,
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
    // return queryInterface.changeColumn("isChoices", "choiceId", {
    //   allowNull: false,
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: "Choices",
    //     key: "choiceId",
    //   },
    //   onDelete: "cascade",
    // });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // return await queryInterface.dropTable("isChoices");
    // return queryInterface.removeColumn("Categories", "updatedAt");
  },
};
