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
    await queryInterface.changeColumn("Users", "grade", {
      type: DataTypes.STRING,
      defaultValue: "주니어 해결사",
    });
    // return await queryInterface.addeColumn("Replies", "userKey", {
    //   allowNull: false,
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: "Users",
    //     key: "userKey",
    //   },
    // });
    return queryInterface.addColumn("Notes", "roomId", {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: "NoteRooms",
        key: "roomId",
      },
      onDelete: "cascade",
    });
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
    return queryInterface.removeColumn("Notes", "roomId");
  },
};
