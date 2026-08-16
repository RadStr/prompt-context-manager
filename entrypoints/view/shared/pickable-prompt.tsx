import type { Prompt } from "../../store/store-iface";

type PickablePromptProps = {
  prompt: Prompt;
  isSelected?: boolean;
  disabled?: boolean;
  onSelect: (prompt: Prompt) => void;
};

export default function PickablePrompt({ prompt, isSelected = false, disabled = false, onSelect }: PickablePromptProps) {
  console.info({isSelected, idd: prompt.id})
  return (
    <button
      type="button"
      title={prompt.text}
      disabled={disabled}
      onClick={() => onSelect(prompt)}
      aria-pressed={isSelected}
      className={"hover:bg-green-400 " + (isSelected ? "bg-green-100" : "bg-gray-100")}
      // className={`w-full rounded-2xl border px-4 py-4 text-left transition focus:outline-none focus:ring-2 focus:ring-slate-300 ${
      //   isSelected
      //     ? "border-slate-600 bg-slate-100 shadow-sm ring-1 ring-slate-300"
      //     : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      // }`}
    >
      <div className={`flex flex-wrap gap-2 text-sm ${disabled ? "text-slate-500" : "text-slate-500"}`}>
        <span>
          {isSelected ? "✅" : "\u00A0\u00A0\u00A0\u00A0"}
          {prompt.name}
          {isSelected ? <em className="text-blue-700 ml-2">(Chosen)</em> : null}</span>
      </div>
    </button>
  );
}
