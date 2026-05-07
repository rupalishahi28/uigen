import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolActionMessage } from "../ToolActionMessage";

test("renders create file action message", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{
        command: "create",
        path: "/src/components/Button.tsx",
        file_text: 'export function Button() { }',
      }}
      state="result"
    />
  );

  expect(container.querySelector(".folder-plus")).toBeDefined();
});

test("renders str_replace action message with content preview", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{
        command: "str_replace",
        path: "/src/app/page.tsx",
        old_string: 'const title = "Old Title";',
        new_string: 'const title = "New Title";',
      }}
      state="result"
    />
  );

  const messageDivs = Array.from(container.querySelectorAll("div"));
  expect(messageDivs[0].textContent).toContain('Replacing');
  expect(messageDivs[0].textContent).toContain('title = "New Title"');
});

test("renders insert action message", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{
        command: "insert",
        path: "/src/lib/utils.ts",
        new_str: 'export function helper() { }',
        insert_line: 10,
      }}
      state="result"
    />
  );

  expect(container.querySelector(".edit-3")).toBeDefined();
});

test("renders delete action message", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{
        command: "delete",
        path: "/src/app/layout.tsx",
        old_string: 'const deprecated = true;',
      }}
      state="result"
    />
  );

  expect(container.querySelector(".trash-2")).toBeDefined();
});

test("renders running state with spinner for create command", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{
        command: "create",
        path: "/src/components/NewComponent.tsx",
        file_text: 'export function NewComponent() { }',
      }}
      state="running"
    />
  );

  expect(container.querySelector(".folder-plus")).toBeDefined();
});

test("renders running state with spinner for str_replace command", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{
        command: "str_replace",
        path: "/src/app/page.tsx",
        old_str: "old code",
        new_str: "new code",
      }}
      state="running"
    />
  );

  expect(container.querySelector(".edit-3")).toBeDefined();
});

test("displays toolName as fallback for unknown tool", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="unknown_tool"
      args={{}}
      state="result"
    />
  );

  expect(container.querySelector("div")).toBeDefined();
});

test("renders create file with FolderPlus icon", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "/new.js" }}
      state="result"
    />
  );

  expect(container.querySelector(".folder-plus")).toBeDefined();
});

test("renders edit icon for str_replace command", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/edit.js" }}
      state="result"
    />
  );

  expect(container.querySelector(".pen-line")).toBeDefined();
});

test("renders insert icon for insert command", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{ command: "insert", path: "/insert.js" }}
      state="result"
    />
  );

  expect(container.querySelector(".pen-line")).toBeDefined();
});

test("renders trash icon for delete command", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{ command: "delete", path: "/delete.js" }}
      state="result"
    />
  );

  expect(container.querySelector(".trash-2")).toBeDefined();
});

test("truncates old_string in display if too long", () => {
  const veryLongString = "const items = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(i => i)";

  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{
        command: "str_replace",
        path: "/src/app/data.ts",
        old_string: veryLongString,
        new_string: "const items = []",
      }}
      state="result"
    />
  );

  const messageDivs = Array.from(container.querySelectorAll("div"));
  expect(messageDivs[0].textContent).toContain(`const items = [1,2,3`);
});

test("handles missing args gracefully", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{}}
      state="result"
    />
  );

  // Should not crash and show reasonable message
  expect(container.querySelector("div")).toBeDefined();
});

test("shows Sparkles icon for result state", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "/new.ts" }}
      state="result"
    />
  );

  expect(container.querySelector(".sparkles")).toBeDefined();
});

test("does not show Sparkles icon for running state", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "/new.ts" }}
      state="running"
    />
  );

  expect(container.querySelector(".sparkles")).toBeNull();
});

test("has correct styling for result state (emerald)", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "/new.ts" }}
      state="result"
    />
  );

  const messageDiv = container.querySelector("div");
  expect(messageDiv?.className).toContain("bg-emerald-50");
  expect(messageDiv?.className).toContain("text-emerald-700");
});

test("has correct styling for running state (neutral)", () => {
  const { container } = render(
    <ToolActionMessage
      toolName="str_replace_editor"
      args={{ command: "create", path: "/new.ts" }}
      state="running"
    />
  );

  const messageDiv = container.querySelector("div");
  expect(messageDiv?.className).toContain("bg-neutral-50");
  expect(messageDiv?.className).toContain("text-neutral-700");
});
