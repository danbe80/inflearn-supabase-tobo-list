"use client";

import { IconButton, Checkbox, Input } from "@material-tailwind/react";
import { useState } from "react";

export default function Todo() {
  const [isEditing, setIsEditing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [date, setDate] = useState(new Date());
  const [content, setContent] = useState("New TODO");

  function formatDate(date) {
    return `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date
      .getDate()
      .toString()
      .padStart(2, "0")} ${date.getHours()}:${date.getMinutes()}`;
  }

  return (
    <div className="w-full flex items-center gap-2">
      <Checkbox
        className="flex-none"
        checked={completed}
        onClick={(e) => setCompleted(!completed)}
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
          <span className="text-xs absolute bottom-5 text-gray-600">
            {formatDate(date)}
          </span>
          <p className={`flex-1 ${completed && "line-through"}`}>{content}</p>
        </div>
      )}
      <IconButton
        className="flex-none"
        onClick={(e) => setIsEditing(!isEditing)}
      >
        <i className={`fas fa-${isEditing ? "check" : "pen"}`} />
      </IconButton>
      <IconButton className="flex-none">
        <i className="fas fa-trash" />
      </IconButton>
    </div>
  );
}
