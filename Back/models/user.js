import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    firstName: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING(32),
      allowNull: false,
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
    tableName: "users",   // nombre exacto en MySQL
    timestamps: true,     // createdAt / updatedAt
  }
);

export default User;