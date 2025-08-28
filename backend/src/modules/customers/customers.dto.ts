import { z } from 'zod';

export const CreateCustomerDto = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
});

export const UpdateCustomerDto = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
});
