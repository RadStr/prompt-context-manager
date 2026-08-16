import React, { useState } from "react";
import { toast } from "sonner";
import { getPromptStore } from "../../../store/local-browser-store";
import { createUniqueId, type Prompt } from "../../../store/store-iface";
import { PromptTypeComboBoxComponent } from "../../shared/prompt-type-combobox";
import PromptList from "./parts/prompt-list";

const store = getPromptStore();

type PromptManipulationDataProps = {
  id: string;
  initialText: string;
  initialName?: string;
}

type PromptManipulationActionProps = {
  onCancel: () => void;
  onSave: (prompt: Prompt) => void;
}

type PromptManipulationProps = {
  dialogTitle: string;
  data: PromptManipulationDataProps | null;
  actions: PromptManipulationActionProps
}

export function PromptManipulation(promptData: PromptManipulationProps) {
  const promptTypeComponent = PromptTypeComboBoxComponent();
  const [refreshSignal, setRefreshSignal] = useState(0);

  const givenText = promptData.data?.initialText || "";
  const givenName = promptData.data?.initialName || "";
  // Can be computed once in useEffect
  const id = promptData.data?.id !== undefined
    ? promptData.data.id
    : createUniqueId()
  const [text, setText] = useState(givenText);
  const [name, setName] = useState(givenName);

  function save() {
    const prompt: Prompt = {
      id,
      name,
      modificationDate: new Date().toISOString(),
      text,
      promptType: promptTypeComponent.promptType,
    };

    promptData.actions.onSave(prompt);
    toast.success("Prompt saved", { richColors: true });
    setName("");
    setText("");
    setRefreshSignal((previous) => previous + 1);
  }


  return (
    <div className="p-3 border border-gray-300 rounded-lg max-w-[520px] bg-white">
      <h3>{promptData.dialogTitle}</h3>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Prompt name"
        className="w-full mb-2 rounded border border-gray-300 p-2"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter prompt text"
        rows={6}
        className="w-full mb-2 rounded border border-gray-300 p-2 resize-none"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={save}
          disabled={!name.trim() || !text.trim()}
          className="rounded bg-blue-600 px-3 py-1.5 text-white disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          Save
        </button>
        <button
          onClick={promptData.actions.onCancel}
          className="rounded border border-gray-300 px-3 py-1.5"
        >
          Cancel
        </button>
      </div>
      {promptTypeComponent.componentRender}
      <div className="mt-6">
        <PromptList refreshSignal={refreshSignal} />
      </div>
    </div>
  );
}


type PromptTagComponentProps = {
	allPromptTags: string[];
	setAllPromptTags: React.Dispatch<React.SetStateAction<string[]>>;
}

function PromptTagComponent(props: PromptTagComponentProps) {
	return <div>
		{props.allPromptTags.map(tag => (<div className="bg-red-50">{tag}</div>))}
		{/* <button onClick={(_e) => openTextAreaDialog(props.setPromptTag)}>+</button> */}
	</div>;
}


export default PromptManipulation;
