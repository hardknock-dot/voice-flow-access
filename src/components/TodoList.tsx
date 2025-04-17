
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ListTodo, Trash2 } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
}

const TodoList = ({ todos, onToggleTodo, onDeleteTodo }: TodoListProps) => {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-2">
          <ListTodo className="h-5 w-5" />
          Voice-Enabled Todo List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No todos yet. Try saying "add task buy groceries"
          </p>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => onToggleTodo(todo.id)}
                  id={todo.id}
                  className="focus-visible-outline"
                />
                <label
                  htmlFor={todo.id}
                  className={`flex-1 ${
                    todo.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {todo.text}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteTodo(todo.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete todo</span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TodoList;
