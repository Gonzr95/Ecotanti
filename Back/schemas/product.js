import { z } from 'zod';

export const createProductSchema = z.object({

    productType: z
    .string()
    .nonempty()
    .min(4)
    .max(32),

    brand: z
    .string()
    .nonempty()
    .min(4)
    .max(32),

    lineUp: z
    .string()
    .nonempty()
    .min(4)
    .max(32),

    description: z
    .string()
    .nonempty()
    .min(2)
    .max(64),
 
    stock: z.
    coerce.number()
    .nonnegative(),
    
    price: z.
    coerce.number()
    .nonnegative(),

    isActive: z
    .string()
    .refine(v => v === "true" || v === "false", {
        message: "isActive debe ser 'true' o 'false'"
    })
    .transform(v => v === "true")

});