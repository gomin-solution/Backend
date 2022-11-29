"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MsgMission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Mission, {
        foreignKey: "missionId",
        targetKey: "missionId",
      });
    }
  }
  MsgMission.init(
    {
      missionId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
        references: {
          model: "Missions",
          key: "missionId",
        },
      },
      msgMission: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "MsgMission",
      timestamps: false,
    }
  );
  return MsgMission;
};
