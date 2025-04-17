
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListTodo, Trash2, Plus } from "lucide-react";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onAddTodo: (text: string) => void;
}

const TodoList = ({ todos, onToggleTodo, onDeleteTodo, onAddTodo }: TodoListProps) => {
  const [newTodoText, setNewTodoText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      onAddTodo(newTodoText.trim());
      setNewTodoText("");
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-2">
          <ListTodo className="h-5 w-5" />
          Voice-Enabled Todo List
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Type a new task..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newTodoText.trim()}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add todo</span>
          </Button>
        </form>

        {todos.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No todos yet. Type a task or try saying "add task buy groceries"
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
