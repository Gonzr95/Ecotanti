import { z } from 'zod';

export const createProductSchema = z.object({

  productType: z
  .string({
      required_error: "El tipo de producto es obligatorio, (Ej: Papel Higienico, Lavandina)",
      invalid_type_error: "El nombre debe ser un texto"
  })
  .min(5, "El nombre debe tener al menos 5 caracteres")
  .nonempty("El tipo de producto es obligatorio")
  .max(100, "Mucho texto"),

  brand: z
  .string({
      required_error: "La marca es obligatoria, si no tiene poner Sin marca"
  })
  .min(2, "La marca debe tener al menos 2 caracteres")
  .max(100, "Mucho texto"),

  lineUp: z
  .string({
      required_error: "La linea es requerida, si no tiene poner Sin linea"
  })
  .min(2, "La linea debe tener al menos 2 caracteres")
  .max(100, "Mucho texto"),

  description: z
  .string({
      required_error: "La descripcion es requerida."
  }),

  stock: z
  .coerce
    .number({
      required_error: "El stock es obligatorio.",
    })
    .int("El número debe ser un entero")
    .nonnegative("El número debe ser positivo."),

  price: z.coerce
  
    .number({
      required_error: "El precio es obligatorio.",
    })
    .int("El número debe ser un entero")
    .nonnegative("El número debe ser positivo."),

    /*
  images: z
    .array(
      z.object({
        originalname: z.string(),
        mimetype: z.string(),
        filename: z.string(),
        size: z.number()
      })
    )
    .optional()
    */
});