import { useEffect, useState } from "react";
import { getPromptStore } from "../../../store/local-browser-store";
import type { Prompt } from "../../../store/store-iface";
import { ChatbotWindowExport } from "@/entrypoints/exports/chatbot-window-export";

const store = getPromptStore();

export function CustomPrompts() {
  const [customPrompts, setCustomPrompts] = useState<Prompt[]>([]);

  function refreshCustomPrompts() {
    const allPrompts = store.getAll();
    setCustomPrompts(allPrompts.filter((prompt) => prompt.promptType === "custom"));
  }

  useEffect(() => {
    refreshCustomPrompts();
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold text-slate-900 mb-4">Custom Prompts</h3>
      {customPrompts.length === 0 ? (
        <div className="text-sm text-slate-500">No custom prompts found.</div>
      ) : (
        <ul className="space-y-3">
          {customPrompts.map((prompt) => (
            <li
              key={prompt.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="text-xs text-slate-500">{prompt.id} · {prompt.modificationDate}</div>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-900">{prompt.text}</div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  onClick={() => {
                    new ChatbotWindowExport().exportPrompt(prompt, "APPEND_WITH_PREFIXED_EMPTY_LINE");
                  }}
                >
                  📤
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomPrompts;
