import { z } from 'zod';

export const signupRequestSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
  name: z.string().trim().min(1).max(50),
  password: z.string().min(8).max(72),
});

export type SignupRequestDto = z.infer<typeof signupRequestSchema>;
