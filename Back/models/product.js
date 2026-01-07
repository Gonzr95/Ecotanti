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
      allowNull: false
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

    // CAMPO NUEVO: Almacena el array de rutas de imágenes individuales
    images: {
      type: DataTypes.JSON, // Ideal para arrays/objetos en MySQL
      allowNull: true,
      defaultValue: [],
    },
    
    // CAMPO EXISTENTE: Almacena la ruta de la carpeta base (targetFolder)
    productFolder: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    tableName: "products",   // nombre exacto en MySQL
    timestamps: true,     // createdAt / updatedAt
  }
);

export default Product;