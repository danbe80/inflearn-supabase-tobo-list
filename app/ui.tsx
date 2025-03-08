"use client";

import { Button, IconButton, Input } from "@material-tailwind/react";
import Todo from "components/todo";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createTodo, getTodos } from "actions/todo-actions";

export default function UI() {
  const [searchInput, setSearchInput] = useState("");

  const todosQuery = useQuery({
    queryKey: ["todos", searchInput],
    queryFn: () => getTodos({ searchInput }),
  });

  const createTodoMutation = useMutation({
    mutationFn: () =>
      createTodo({
        title: "New Todo",
        completed: false,
      }),

    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  return (
    <div className="w-2/3 mx-auto flex flex-col items-center py-10 gap-3">
      <h1 className="text-lg font-bold">🍀 TODO LIST</h1>
      <Input
        label="Search TODO"
        placeholder="Search TODO"
        icon={<i className="fas fa-search"></i>}
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />

      {/* <Todo /> */}

      {todosQuery.isPending && <p>Loading...</p>}

      {todosQuery.data &&
        todosQuery.data.map((todo) => <Todo key={todo.id} todo={todo} />)}

      <Button
        className="text-center"
        onClick={() => createTodoMutation.mutate()}
        loading={createTodoMutation.isPending}
      >
        <i className="fas fa-plus mr-2" />
        ADD TODO
      </Button>
    </div>
  );
}
