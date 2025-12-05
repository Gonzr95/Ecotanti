import {z} from 'zod';

export const createTicketSchema = z.object({

  customerName: z.
  string().
  min(1, "El nombre del cliente es obligatorio"),

  cart: z.
  array(
    z.object({
      productId: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().positive().min(1)
    })
  ).min(1, "El ticket debe tener al menos un producto")
});