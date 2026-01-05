import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Ticket = sequelize.define(
  "Ticket",
  {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    customerName: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },

    customerLastName: {
        type: DataTypes.STRING(32),
        allowNull: false,
    },

    total: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },

    paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },

  },
  {
    tableName: "tickets",   // nombre exacto en MySQL
    timestamps: true,     // createdAt / updatedAt
  }
);

export default Ticket;