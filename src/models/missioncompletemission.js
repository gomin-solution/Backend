"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MissionCompleteMission extends Model {
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
  MissionCompleteMission.init(
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
      completeMission: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "MissionCompleteMission",
      timestamps: false,
    }
  );
  return MissionCompleteMission;
};
