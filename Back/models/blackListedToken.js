import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelize.js'; // Ajusta según tu config de DB

export const BlacklistedToken = sequelize.define('BlacklistedToken', {
    token: {
        type: DataTypes.STRING(500), // Los JWT son largos
        allowNull: false,
        unique: true
    }
    // Sequelize añade createdAt y updatedAt automáticamente
}, {
    tableName: "blackListedTokens",   // nombre exacto en MySQL
    timestamps: true
});