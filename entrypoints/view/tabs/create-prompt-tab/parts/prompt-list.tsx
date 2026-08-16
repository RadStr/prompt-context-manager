
import React, { useEffect, useState } from "react";
import { getPromptStore } from "../../../../store/local-browser-store";
import { ChatbotWindowExport } from "../../../../exports/chatbot-window-export";
import { type Prompt } from "../../../../store/store-iface";
import { type PromptMessageType } from "../../../../model/browser-message-types";
import { PromptBuilder } from "@/entrypoints/model/prompt-builder";

const store = getPromptStore();

type PromptListProps = {
  refreshSignal: number;
};

export function PromptList({ refreshSignal }: PromptListProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editName, setEditName] = useState("");
  const [editText, setEditText] = useState("");

  function refreshPrompts() {
    const promptsDirectlyFromStore = store.getAll().filter((prompt) => prompt.promptType !== "custom");
    setPrompts(promptsDirectlyFromStore);
  }

  useEffect(() => {
    refreshPrompts();
  }, []);

  useEffect(() => {
    if (refreshSignal !== undefined) {
      refreshPrompts();
    }
  }, [refreshSignal]);

  useEffect(() => {
    if (editingPrompt) {
      setEditName(editingPrompt.name);
      setEditText(editingPrompt.text);
    } else {
      setEditName("");
      setEditText("");
    }
  }, [editingPrompt]);

  function removePrompt(id: string) {
    store.remove(id);
    if (editingPrompt?.id === id) {
      setEditingPrompt(null);
    }
    refreshPrompts();
  }

  function startEditPrompt(prompt: Prompt) {
    setEditingPrompt(prompt);
  }

  function cancelEditPrompt() {
    setEditingPrompt(null);
  }

  function saveEditPrompt() {
    if (!editingPrompt) {
      return;
    }

    store.store(editingPrompt.id, {
      ...editingPrompt,
      name: editName,
      text: editText,
      modificationDate: new Date().toISOString(),
    });

    refreshPrompts();
    setEditingPrompt(null);
  }

  async function exportPrompt(prompt: Prompt) {
    const promptBuilder = new PromptBuilder();
    promptBuilder.addPrompt(prompt);
    promptBuilder.export(new ChatbotWindowExport(), "APPEND_PROMPT");
  }

  async function exportPromptAdditional(prompt: Prompt) {
    const exporter = new ChatbotWindowExport();
    await exporter.exportPrompt(prompt, "APPEND_WITH_PREFIXED_EMPTY_LINE");
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold">User saved prompts</h3>
          <span className="text-sm text-slate-500">{prompts.length} saved</span>
        </div>

        {prompts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No prompts saved.
          </div>
        ) : (
          <ul className="space-y-3">
            {prompts.map((prompt) => (
              <li key={prompt.id} title={prompt.text} className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:border-slate-300 hover:bg-slate-100">
                <div className="text-sm text-slate-500">
                  {prompt.name} - <em className="text-xs">{prompt.promptType}</em>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      removePrompt(prompt.id);
                    }}
                    className="rounded border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      startEditPrompt(prompt);
                    }}
                    className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={async (event) => {
                      event.stopPropagation();
                      await exportPrompt(prompt);
                    }}
                    className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    📤
                  </button>
                  <button
                    onClick={async (event) => {
                      event.stopPropagation();
                      await exportPromptAdditional(prompt);
                    }}
                    className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    📤 (append)
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* TODO: Ideally make this and the create react component a single component and instaiate, but I cannot be really bothered at least now */}
      {editingPrompt ? (
        // inset-0 (sets all four positional offsets to 0) makes it dialog like in the middle and
        //  bg-slate-950/40 makes the background shadowed/darker - the /40 is opacity ... note that the inner div is white (bg/whte)
        // so it makes it take the whole screen, which is made darker and transparent so i see the stuff behind it and the dialog is inner div
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onClick={cancelEditPrompt}
        >
          {/* The inner div */}
          <div
            className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">Edit prompt</h4>
                <p className="mt-1 text-sm text-slate-500">Update the saved prompt name and content.</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                Name
                <input
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Text
                <textarea
                  value={editText}
                  onChange={(event) => setEditText(event.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveEditPrompt}
                disabled={!editName.trim() || !editText.trim()}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Save changes
              </button>
              <button
                type="button"
                onClick={cancelEditPrompt}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PromptList;

