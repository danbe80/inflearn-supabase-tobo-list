"use client";

import { IconButton, Checkbox, Input, Spinner } from "@material-tailwind/react";
import { useMutation } from "@tanstack/react-query";
import { deleteTodo, updateTodo } from "actions/todo-actions";
import { queryClient } from "config/ReactQueryClientProvider";
import { useState } from "react";

export default function Todo({ todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(todo.completed);
  const [date, setDate] = useState(todo.created_at);
  const [content, setContent] = useState(todo.title);
  const [more, setMore] = useState(todo.title.length > 60);
  // UTC => KST 날짜 포맷 함수
  function formatDate(date) {
    const createAt = new Date(date);
    const utc = createAt.getTime();
    const koreaTimeDiff = createAt.getTimezoneOffset();
    const koreaDate = new Date(utc - koreaTimeDiff * 60000);

    return `${koreaDate.getFullYear()}.${(koreaDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${koreaDate.getDate().toString().padStart(2, "0")} ${
      koreaDate.getHours() == 0
        ? "24"
        : koreaDate.getHours().toString().padStart(2, "0")
    }:${koreaDate.getMinutes().toString().padStart(2, "0")}`;
  }

  const updateTodoMutation = useMutation({
    mutationFn: () =>
      updateTodo({
        id: todo.id,
        title: content,
        completed,
        // updated_at: new Date().toString(),
      }),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
    onError(error, variables, context) {
      console.log(error);
    },
  });

  function editTodoButton() {
    if (!isEditing) {
      setIsEditing(!isEditing);
    } else {
      // 기존 테이터에서 내용이 변경 되었을시만 업데이트
      if (todo.title === content) {
        setIsEditing(false);
      } else {
        console.log("업데이트 해야함");
        updateTodoMutation.mutate();
      }
    }
  }

  const deleteTodoMutation = useMutation({
    mutationFn: () => deleteTodo(todo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  return (
    <div className="w-full flex items-center gap-2">
      <Checkbox
        className="flex-none"
        checked={completed}
        onClick={async (e) => {
          await setCompleted(!completed);
          await updateTodoMutation.mutate();
        }}
      />

      {isEditing ? (
        <Input
          variant="standard"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 text-lg pb-4"
        />
      ) : (
        <div className="relative flex-1">
          <span className="text-xs bottom-5 text-gray-600">
            {todo.updated_at ? (
              <>
                {formatDate(todo.updated_at)}
                <span className="ml-1">(수정됨)</span>
              </>
            ) : (
              formatDate(todo.created_at)
            )}
          </span>
          <p className={`flex-1 ${completed && "line-through"}`}>
            {more ? (
              <>
                {content.slice(0, 60)}...
                <button
                  className="text-gray-500 underline text-sm"
                  onClick={() => setMore(false)}
                >
                  more
                </button>
              </>
            ) : (
              content
            )}
          </p>
        </div>
      )}

      <IconButton className="flex-none" onClick={() => editTodoButton()}>
        {updateTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className={`fas fa-${isEditing ? "check" : "pen"}`} />
        )}
      </IconButton>
      <IconButton
        className="flex-none"
        onClick={() => deleteTodoMutation.mutate()}
      >
        {deleteTodoMutation.isPending ? (
          <Spinner />
        ) : (
          <i className="fas fa-trash" />
        )}
      </IconButton>
    </div>
  );
}
