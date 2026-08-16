import { useEffect, useState } from "react";
import { getPromptStore } from "../../../store/local-browser-store";
import type { LengthPrompt, Prompt } from "../../../store/store-iface";
import PromptManipulation from "../create-prompt-tab/prompt-manipulation";
import { ClipboardExport } from "../../../exports/clipboard-export";
import { ChatbotWindowExport } from "../../../exports/chatbot-window-export";
import SwitchablePromptsList from "../../shared/switchable-prompts-list";
import RadioPrompts from "./parts/radio-prompts";
import { PromptBuilder } from "@/entrypoints/model/prompt-builder";
import { useDifferentPromptTypes } from "./parts/base-parts-hook";
import { concatWithDefaultPrompts } from "@/entrypoints/store/default-prompts";
import { PromptType } from "@/entrypoints/model/prompt-types";

const store = getPromptStore();

export function BasePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  // These will be put into state
  const allPromptTypesFromHook = useDifferentPromptTypes();
  const { length, role, correctness, tone, format, answerPersona, answerRole } = allPromptTypesFromHook;

  function refreshPrompts() {
    setPrompts(() => {
      const promptsDirectlyFromStore = store.getAll().filter((prompt) => prompt.promptType !== "custom");
      const allPrompts = concatWithDefaultPrompts(promptsDirectlyFromStore, "all");

      setInitialPromptForType(role.value, role.setValue, "role", allPrompts);
      setInitialPromptForType(length.value, length.setValue, "length", allPrompts);
      setInitialPromptForType(correctness.value, correctness.setValue, "correctness", allPrompts);
      setInitialPromptForType(tone.value, tone.setValue, "tone", allPrompts);
      setInitialPromptForType(format.value, format.setValue, "format", allPrompts);
      setInitialPromptForType(answerPersona.value, answerPersona.setValue, "answer persona", allPrompts);
      setInitialPromptForType(answerRole.value, answerRole.setValue, "answer role", allPrompts);

      return allPrompts;
    });
  }

  useEffect(() => {
    refreshPrompts();
  }, []);

  function removePrompt(id: string) {
    store.remove(id);
    refreshPrompts();
    if (editingPrompt?.id === id) {
      setEditingPrompt(null);
    }
  }

  function closeEditPrompt() {
    setEditingPrompt(null);
  }

  function handleLengthChoiceChange(newLengthPrompt: LengthPrompt) {
    length.setValue(newLengthPrompt.id);
  }

  function updatePrompt(prompt: Prompt) {
    store.store(prompt.id, prompt);
    refreshPrompts();
    setEditingPrompt(null);
  }

  if (prompts.length === 0) {
    return <div className="p-4">No prompts saved.</div>;
  }

  return (
    <div className="p-4">

      <RadioPrompts allRadioPrompts={prompts.filter(p => p.promptType === "length") as LengthPrompt[]} currrentPrompt={length.value} onChange={handleLengthChoiceChange} />
      <SwitchablePromptsList
        title="Role Prompts"
        description="Pick role prompts to include in the current selection."
        prompts={prompts.filter((prompt) => prompt.promptType === "role")}
        selectedPromptId={role.value}
        setSelectedPromptId={role.setValue}
      />
      <SwitchablePromptsList
        title="Correctness Prompts"
        description="Pick correctness prompts to include in the current selection."
        prompts={prompts.filter((prompt) => prompt.promptType === "correctness")}
        selectedPromptId={correctness.value}
        setSelectedPromptId={correctness.setValue}
      />
      <SwitchablePromptsList
        title="Format Prompts"
        description="Pick format of the answer."
        prompts={prompts.filter((prompt) => prompt.promptType === "format")}
        selectedPromptId={format.value}
        setSelectedPromptId={format.setValue}
      />
      <SwitchablePromptsList
        title="Tone Prompts"
        description="Pick tone of the answer."
        prompts={prompts.filter((prompt) => prompt.promptType === "tone")}
        selectedPromptId={tone.value}
        setSelectedPromptId={tone.setValue}
      />
      <SwitchablePromptsList
        title="Answer role Prompts"
        description="Pick the answer role."
        prompts={prompts.filter((prompt) => prompt.promptType === "answer role")}
        selectedPromptId={answerRole.value}
        setSelectedPromptId={answerRole.setValue}
      />
      <SwitchablePromptsList
        title="Answer persona Prompts"
        description="Pick the answer persona."
        prompts={prompts.filter((prompt) => prompt.promptType === "answer persona")}
        selectedPromptId={answerPersona.value}
        setSelectedPromptId={answerPersona.setValue}
      />

      {editingPrompt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 100,
          }}
          onClick={closeEditPrompt}
        >
          <div
            style={{
              width: "min(100%, 560px)",
              background: "#f8f8f8",
              borderRadius: 10,
              boxShadow: "0 14px 32px rgba(0,0,0,0.15)",
              padding: 16,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <PromptManipulation
              dialogTitle="Edit Prompt"
              data={{
                id: editingPrompt.id,
                initialText: editingPrompt.text,
                initialName: editingPrompt.name,
              }}
              actions={{
                onCancel: closeEditPrompt,
                onSave: updatePrompt,
              }}
            />
          </div>
        </div>
      )}

      <button className="bg-blue-100 hover:bg-blue-600 border rounded my-2 p-2" onClick={() => {
        const promptBuider = new PromptBuilder();
        const relevantPrompts = Object.values(allPromptTypesFromHook).map((hookItem) => hookItem.value);
        for (const promptId of relevantPrompts) {
          if (promptId !== null || promptId !== undefined) {
            const prompt = prompts.find((p) => p.id === promptId);
            if (prompt !== undefined) {
              promptBuider.addPrompt(prompt);
            }
          }
        }
        promptBuider.export(new ChatbotWindowExport(), "APPEND_PROMPT");
      }}>
        📤
      </button>
    </div>
  );
}

function setInitialPromptForType(
  currentValue: string | null,
  setValue: (v: string | null) => void,
  promptType: PromptType,
  allPrompts: Prompt[]
) {
  if (currentValue === null) {
    const firstPromptOfGivenType = allPrompts.find(p => p.promptType === promptType);
    setValue(firstPromptOfGivenType?.id ?? null);
  }
}

export default BasePrompts;
