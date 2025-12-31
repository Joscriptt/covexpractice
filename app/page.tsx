import CreateTodo from "@/components/todos/create-todo";
import TodoList from "@/components/todos/todo-list";

export default function Home() {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {/* <h1>Welcome to the Home Page</h1> */}
      {/* <CreateTodo /> */}
      <TodoList />
    </div>
  );
}
