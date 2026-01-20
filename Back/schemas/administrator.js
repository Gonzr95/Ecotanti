import { z } from 'zod';

export const registerAdminSchema = z.object({

    mail: z.string({
        required_error: "El email es obligatorio",
    })
    .email("Formato de email inválido") // 👈 Mensaje de error directamente como argumento de .email()
    .nonempty("El email es obligatorio"), // 👈 Opcional: para asegurar que no sea un string vacío

    pass: z.string({
        required_error: "La contraseña es obligatoria"
    }).min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
});

export const loginAdminSchema = z.object({
    mail: z.string({ required_error: "Email requerido" })
           .email("Email inválido"),
    pass: z.string({ required_error: "Contraseña requerida" })
           .min(1, "Contraseña requerida")
});