import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { zCustomMutation } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import { getAuthUserId } from "@convex-dev/auth/server";
import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "../lib/zod";

const zMutation = zCustomMutation(mutation, NoOp);

export const getTodos = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    // const todos = await ctx.db.query("todos").collect();
    const todos = await ctx.db
      .query("todos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
    return todos.reverse();
  },
});

export const addTodo = zMutation({
  args: createTodoSchema.shape,
  handler: async (ctx, { title, completed }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    return await ctx.db.insert("todos", { title, completed: false, userId });
    // await ctx.db.insert("todos", { title, completed });
  },
});

// export const addTodo = mutation({
//   args: { title: v.string(), completed: v.boolean() },
//   handler: async (ctx, { title, completed }) => {
//     await ctx.db.insert("todos", { title, completed: false });
//     // await ctx.db.insert("todos", { title, completed });
//   },
// });

export const updateTodo = zMutation({
  args: updateTodoSchema.shape,
  handler: async (ctx, { id, title, completed }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    // Verify the todo belongs to the user before updating
    const existingUserTodo = await ctx.db.get(id);
    if (!existingUserTodo) {
      throw new Error("Todo not found");
    }
    if (existingUserTodo.userId !== userId) {
      throw new Error("Unauthorized - this todo belongs to another user");
    }
    await ctx.db.patch("todos", id, { title, completed });
  },
});

export const deleteTodo = zMutation({
  args: deleteTodoSchema.shape,
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const existingTodo = await ctx.db.get(id);
    if (!existingTodo) {
      throw new Error("Todo not found");
    }
    if (existingTodo.userId !== userId) {
      throw new Error("Unauthorized - this todo belongs to another user");
    }
    await ctx.db.delete("todos", id);
    if (!existingTodo) {
      throw new Error("Todo not found");
    }
  },
});
