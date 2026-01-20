import { Administrator } from '../models/administrator.js'; 
import { hashPassword, comparePassword} from '../utils/bcrypt.js'; 
import { generateToken } from '../utils/jwt.js';
import { BlacklistedToken } from '../models/blackListedToken.js';

export async function register(adminData) {
    const { mail, pass } = adminData;

    const hashedPass = await hashPassword(pass);

    const newAdmin = await Administrator.create({
        mail,
        pass: hashedPass
    });

    const adminResponse = newAdmin.toJSON();
    delete adminResponse.pass; 
    
    return adminResponse;
}

export async function loginAdmin({ mail, pass }) {
    const admin = await Administrator.findOne({ where: { mail } });

if (!admin) {
        throw new Error("Admin_NOT_FOUND"); 
    }

    // 2. Comparar contraseñas
    const isPasswordValid = await comparePassword(pass, admin.pass)
    if (!isPasswordValid) {
        throw new Error("WRONG_PASSWORD");
    }

    // 3. Generar Token
    // Guardamos en el token datos útiles (id, email, rol) pero NUNCA la password
    const token = generateToken({ id: admin.id, mail: admin.mail });

    // 4. Retornar info del usuario (sin pass) y el token
    const adminData = admin.toJSON();
    delete adminData.pass;
    delete adminData.createdAt;
    delete adminData.updatedAt;
    delete adminData.id;

    return { token, admin: adminData };
}

export async function logoutAdmin(token) {
    // Simplemente guardamos el token en la lista negra
    // La BD puede crecer indefinidamente, programar una tarea en la BD para hacer limpiezas
    await BlacklistedToken.create({ token });
}