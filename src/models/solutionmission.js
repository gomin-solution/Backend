"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SolutionMission extends Model {
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
  SolutionMission.init(
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
      solutionMission: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "SolutionMission",
      timestamps: false,
    }
  );
  return SolutionMission;
};
