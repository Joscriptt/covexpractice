"use client";

import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodIssue } from "zod";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
// import { createTodoSchema } from "@/lib/zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";

const createTodoSchema = z.object({
  title: z.string(),
  completed: z.boolean().default(false),
  // completed: z.boolean().default(false),
});

// type TodoFormData = z.infer<typeof createTodoSchema>;
type TodoFormData = z.input<typeof createTodoSchema>;

export default function CreateTodo() {
  const createTodo = useMutation(api.todos.addTodo);
  const form = useForm<TodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
      // completed: false,
    },
  });

  useEffect(() => {
    const shouldFocusInput = !form.formState.isSubmitting;
    if (shouldFocusInput) {
      form.setFocus("title");
    }
  }, [form.formState.isSubmitting, form]);

  const getInputClassName = () => {
    const baseClasses =
      "px-4 py-5 focus:outline-none focus:ring-0 active:outline-none active:ring-0 focus-visible:ring-0 focus-visible:outline-none border rounded-xl";
    const errorClasses =
      "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20 focus:border-red-500";
    const defaultClasses =
      "shadow-md shadow-primary/20 border-primary/50 bg-primary text-primary-foreground placeholder:text-primary-foreground/50";

    return cn(
      baseClasses,
      form.formState.errors.title ? errorClasses : defaultClasses
    );
  };

  const handleCreateTodo = async (data: TodoFormData) => {
    console.log(data);
    console.log(form.formState.errors);
    try {
      await createTodo({ title: data.title, completed: false });
      form.reset();
    } catch (error) {
      handleTodoCreationError(error);
    }
  };

  const handleTodoCreationError = (error: unknown) => {
    if (error instanceof ConvexError && error.data.ZodError) {
      const zodError = error.data.ZodError as ZodIssue[];
      const titleError = zodError.find((err) => err.path.includes("title"));
      if (titleError) {
        form.setError("title", { message: titleError.message });
      }
    } else {
      form.setError("title", { message: "Failed to create todo" });
    }
  };

  // const handleTodoCreationError = (error: unknown) => {
  // 	if (error instanceof ConvexError && error.data.ZodError) {
  // 		const zodError = error.data.ZodError as ZodIssue[];
  // 		const titleError = zodError.find((err) => err.path.includes("title"));
  // 		if (titleError) {
  // 			form.setError("title", { message: titleError.message });
  // 		}
  // 	} else {
  // 		form.setError("title", { message: "Failed to create todo" });
  // 	}
  // };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateTodo, (errors) =>
          console.log("VALIDATION ERRORS", errors)
        )}
        className="w-full"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  ref={field.ref}
                  type="text"
                  placeholder="What are you planning to do?"
                  disabled={form.formState.isSubmitting}
                  className={getInputClassName()}
                  // onChange={(e) => {
                  //   e.preventDefault();
                  //   if (e.target.value === "") {
                  //     return null;
                  //   }
                  // }}
                />
              </FormControl>
              <FormMessage className="text-red-500 font-bold" />
            </FormItem>
          )}
        />
        <button
          disabled={!form.watch("title")?.trim()}
          type="submit"
          className="hidden"
        />
      </form>
    </Form>
  );
}
