"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdviceImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Advice, {
        foreignKey: "adviceId",
        targetKey: "adviceId",
      });
    //   this.hasMany(models.Comment, {
    //     foreignKey: "adviceId",
    //     sourceKey: "adviceId",
    //   });
    //   this.hasMany(models.Save, {
    //     foreignKey: "adviceId",
    //     sourceKey: "adviceId",
    //   });
    }
  }
  AdviceImage.init(
    {
      adviceimageId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      adviceId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Advice",
          key: "adviceId",
        },
        onDelete: 'cascade',
      },
      adviceImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "AdviceImage",
    }
  );
  return AdviceImage;
};