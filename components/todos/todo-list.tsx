"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Icons } from "../icons/icon";
import CreateTodo from "./create-todo";
import TodoItem from "./todoItem";

export default function TodoList() {
  const todos = useQuery(api.todos.getTodos);

  if (todos === undefined) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-2">
        <Icons.loading className="size-12" />
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-2">
        <div className="text-xl font-semibold text-muted-foreground">
          <h1>No task yet</h1>
        </div>

        <p className="text-sm text-muted-foreground">Add some task pls</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* <CreateTodo /> */}

      {todos.map((todo) => (
        <TodoItem key={todo._id} todo={todo} />
        // <p key={todo._id}>{todo.title}</p>
      ))}
    </div>
  );
}
