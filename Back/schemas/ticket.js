import {z} from 'zod';

export const createTicketSchema = z.object({

  customerData: z.object({
        name: z.string({
            required_error: "El nombre es obligatorio",
            invalid_type_error: "El nombre debe ser texto"
        }).min(2, "El nombre debe tener al menos 2 caracteres"),
        
        lastName: z.string({
            required_error: "El apellido es obligatorio"
        }).min(2, "El apellido debe tener al menos 2 caracteres"),
    }),

    cart: z.array(
        z.object({
            // Asumo que este 'id' es el ID del producto que tienes en tu DB
            id: z.number({
                required_error: "El ID del producto es necesario"
            }),
            
            quantity: z.number()
                .int("La cantidad debe ser un número entero")
                .positive("La cantidad debe ser mayor a 0"),

            // IMPORTANTE: Definimos el objeto 'product' para que la validación pase,
            // pero lo marcaremos como opcional o passthrough. 
            // Recuerda: NO usaremos el precio que viene aquí para el cobro final.
            product: z.object({
                price: z.number().optional(),
                stock: z.number().optional(),
                brand: z.string().optional()
            }).passthrough().optional() 
        })
    ).min(1, "El carrito no puede estar vacío") // Validación para que no envíen un array vacío
});