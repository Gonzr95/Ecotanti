import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Administrator = sequelize.define(
  "Administrator",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    mail: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    pass: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "administrators",   // nombre exacto en MySQL
    timestamps: true,     // createdAt / updatedAt
  }
);

export default Administrator;