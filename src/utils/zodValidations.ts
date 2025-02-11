import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "O nome de usuário não deve estar vazio"),
  password: z.string().min(4, "A senha deve ter pelo menos 4 caracteres"),
});
