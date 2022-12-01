"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
    //  * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // await queryInterface.changeColumn("Notes", "roomId", {
    //   allowNull: false,
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: "NoteRooms",
    //     key: "roomId",
    //   },
    //   onDelete: "cascade",
    // });
    await queryInterface.addColumn("Users", "commentActivity", {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn("Users", "choiceActivity", {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn("Users", "choicePostActivity", {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn("Users", "advicePostActivity", {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn("Users", "receiveLikeActivity", {
      allowNull: false,
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    // return await queryInterface.addeColumn("Replies", "userKey", {
    //   allowNull: false,
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: "Users",
    //     key: "userKey",
    //   },
    // });
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
    // return queryInterface.dropTable("DailyUpdate");
    // return queryInterface.removeColumn("AdviceImages", "resizeImage");
    // return queryInterface.removeColumn("Users", "resizeImg");
  },
};
