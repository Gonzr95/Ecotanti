import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config(); // Cargar variables desde .env


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ?? 3306,
    dialect: "mysql",
    logging: false,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Conexión a MySQL establecida correctamente.");
  } catch (error) {
    console.error("Error al conectar con MySQL:", error);
    }
};

export { sequelize, connectDB };