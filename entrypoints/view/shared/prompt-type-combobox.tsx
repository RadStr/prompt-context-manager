import { PROMPT_TYPE_TO_NAME, PROMPT_TYPE_VALUES, PromptType } from "@/entrypoints/model/prompt-types";

export function PromptTypeComboBoxComponent() {
  const [promptType, setPromptType] = useState<PromptType>("role");
  return {
    componentRender: <div className="flex flex-row">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <label htmlFor="prompt-type-select" className="flex items-center gap-1">
          Type:
          <select
            id="prompt-type-select"
            value={promptType}
            onChange={(e) => setPromptType(e.target.value as PromptType)}
            className="rounded border border-gray-300 bg-white px-2 py-1"
          >
            {PROMPT_TYPE_VALUES.map((optionValue) => (<option key={optionValue} value={optionValue}>{PROMPT_TYPE_TO_NAME[optionValue]}</option>))}
          </select>
        </label>
      </div>
    </div>,
    promptType: promptType,
  };
}
