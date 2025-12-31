import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { zCustomMutation } from "convex-helpers/server/zod";
import { NoOp } from "convex-helpers/server/customFunctions";
import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "../lib/zod";

const zMutation = zCustomMutation(mutation, NoOp);

export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();
    return todos.reverse();
  },
});

export const addTodo = zMutation({
  args: createTodoSchema.shape,
  handler: async (ctx, { title, completed }) => {
    return await ctx.db.insert("todos", { title, completed: false });
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
    await ctx.db.patch("todos", id, { title, completed });
  },
});

export const deleteTodo = zMutation({
  args: deleteTodoSchema.shape,
  handler: async (ctx, { id }) => {
    await ctx.db.delete("todos", id);
  },
});
