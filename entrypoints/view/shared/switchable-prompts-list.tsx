import React, { useEffect, useState } from "react";
import type { Prompt } from "../../store/store-iface";
import PickablePrompt from "./pickable-prompt";


// Nice place to try different state management apporoaches (Zustand and Redux and prop drilling)
type SwitchablePromptsListProps = {
  title: string;
  description?: string;

  prompts: Prompt[];
  selectedPromptId: string | null;
  setSelectedPromptId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function SwitchablePromptsList({
  title,
  description,

  prompts,
  selectedPromptId,
  setSelectedPromptId,
}: SwitchablePromptsListProps) {

  const [isEnabled, setIsEnabled] = useState<boolean>(true);


  return (
    <section title={description} className={`rounded-3xl border shadow-sm ${!isEnabled ? "border-slate-300 bg-slate-100 text-slate-500" : "border-slate-200 bg-white"}`}>
      <div className="flex flex-row border-b px-2 border-slate-200sm:flex-row sm:items-center sm:justify-between">
        <label className="inline-flex pl-2 cursor-pointer items-center gap-1 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={() => {
              setIsEnabled(currVal => {
                const isNowEnabled = !currVal
                if (!isNowEnabled) {
                  setSelectedPromptId(null);
                }
                return isNowEnabled;
              })
            }}
            className="h-4 w-4 rounded border-slate-300 text-slate-700 focus:ring-slate-400"
          />
          <span>{isEnabled ? "On" : "Off"}</span>
        </label>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {isEnabled ? (
          prompts.length === 0 ? null : (
            <div className="flex flex-col bg-white">
              {prompts.map((prompt) => (
                <PickablePrompt
                  key={prompt.id}
                  prompt={prompt}
                  isSelected={prompt.id === selectedPromptId}
                  disabled={!isEnabled}
                  onSelect={() => setSelectedPromptId(prompt.id)}
                />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500 flex items-center justify-center">
            Prompt list disabled
          </div>
        )}
      </div>
    </section>
  );
}
