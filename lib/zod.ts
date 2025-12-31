import { zid } from "convex-helpers/server/zod";
import { z } from "zod";

export const createTodoSchema = z.object({
  title: z.string().min(1, "Todo must contain at least 6 characters"),
  completed: z.boolean().default(false),
  // completed: z.boolean().default(false),
});

export const updateTodoSchema = z.object({
  id: zid("todos"),
  title: z
    .string()
    .trim()
    .min(3, "Todo title must contain 3 characters")
    .transform((v) => v.replace(/\s+/g, " ")),
  completed: z.boolean(),
});

export const deleteTodoSchema = z.object({
  id: zid("todos"),
});
