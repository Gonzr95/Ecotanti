import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

export const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    productType: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },

    brand: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },

    lineUp: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },

    description: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },

    stock: {
      type: DataTypes.INTEGER,
    },

    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "products",   // nombre exacto en MySQL
    timestamps: true,     // createdAt / updatedAt
  }
);

export default Product;