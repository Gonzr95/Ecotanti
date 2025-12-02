import bcrypt from "bcrypt";

// Función para encriptar password
async function hashPassword(plainTextPassword) {
    const saltRounds = 10; // número de rondas de sal
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    return hash;
}

// Función para comparar password con hash
async function comparePassword(plainTextPassword, hashedPassword) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
}

export {
    hashPassword,
    comparePassword
};