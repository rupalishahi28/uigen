"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, FileCode, FolderPlus, Edit3, Trash2 } from "lucide-react";

interface ToolActionMessageProps {
  toolName: string;
  args: any;
  state?: "running" | "result";
}

function getFileIcon(command: string): React.ReactNode {
  switch (command) {
    case "create":
      return <FolderPlus className="h-3 w-3 text-blue-500" />;
    case "str_replace":
      return <Edit3 className="h-3 w-3 text-purple-500" />;
    case "insert":
      return <Edit3 className="h-3 w-3 text-green-500" />;
    case "delete":
      return <Trash2 className="h-3 w-3 text-red-500" />;
    default:
      return <FileCode className="h-3 w-3 text-gray-400" />;
  }
}

function getActionMessage(toolName: string, args?: any): string {
  if (toolName !== "str_replace_editor") {
    return toolName;
  }

  const { command, path, file_text, old_string, new_string } = args || {};
  const displayName = path ? path.replace(/^\/+/, "") : "unknown";

  switch (command) {
    case "create":
      return `Creating file: ${displayName}`;
    case "str_replace":
      if (old_string && new_string) {
        return `Replacing "${truncateString(old_string, 30)}" with "${truncateString(new_string, 30)}"`;
      }
      return `Editing file: ${displayName}`;
    case "insert":
      return `Inserting lines into: ${displayName}`;
    case "delete":
      return `Deleting from: ${displayName}`;
    default:
      return `Action on: ${displayName}`;
  }
}

function truncateString(str: string, maxLength: number): string {
  if (!str || str.length <= maxLength) {
    return str;
  }
  return str.substring(0, maxLength - 3) + "...";
}

export function ToolActionMessage({ toolName, args, state }: ToolActionMessageProps) {
  const message = getActionMessage(toolName, args);
  const icon = getFileIcon(args?.command || "");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg text-xs font-mono border",
        state === "result"
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-neutral-50 text-neutral-700 border-neutral-200"
      )}
    >
      {state === "result" && (
        <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
      )}
      {icon}
      <span>{message}</span>
    </div>
  );
}
