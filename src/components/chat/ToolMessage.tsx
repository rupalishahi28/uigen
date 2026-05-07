"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ToolMessageProps {
  toolName: string;
  args: any;
  state?: "running" | "result";
}

export function ToolMessage({ toolName, args, state }: ToolMessageProps) {
  const getMessage = () => {
    if (toolName === "str_replace_editor") {
      const { command, file_path, old_string, new_string } = args;

      if (command === "create") {
        return `Creating file: ${file_path}`;
      } else if (command === "str_replace" || command === "insert" || command === "delete") {
        return `Editing file: ${file_path}`;
      }
    }
    // Fallback for other tools or unknown commands
    return toolName;
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-xs font-mono border",
      state === "result"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-neutral-50 text-neutral-700 border-neutral-200"
    )}>
      {state === "result" && (
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
      )}
      {getMessage()}
    </span>
  );
}
