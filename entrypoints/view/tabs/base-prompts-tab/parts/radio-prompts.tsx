import { LengthPrompt as Prompt } from '@/entrypoints/store/store-iface';
import React from 'react';

interface RadioPromptsProps {
  allRadioPrompts: Prompt[];
	currrentPrompt: string | null;
	onChange?: (value: Prompt) => void;
}
const RadioPrompts: React.FC<RadioPromptsProps> = ({ allRadioPrompts, currrentPrompt, onChange }) => {
  // Expect the 0th value to exist (Makes sense we set them on install). Just make sure that the default values cannot be removed
	const [selectedPrompt, setSelected] = React.useState<string>(currrentPrompt ?? allRadioPrompts[0]!.id);

	const handleChange = (lp: Prompt) => {
		setSelected(lp.id);
		onChange?.(lp);
	};

	return (
    <div className="flex flex-col gap-h-2">
      <div>Length:</div>
      {/* The w-fit makes them close to each other */}
      <div role="radiogroup" aria-label="Choose length" className="w-fit grid grid-cols-2 gap-1.5">
        {allRadioPrompts.map((prompt) => (
          <label key={prompt.promptType} className="flex items-center gap-0.5" title={prompt.text}>
            <input
              type="radio"
              value={prompt.id}
              checked={selectedPrompt === prompt.id}
              onChange={() => handleChange(prompt)}
            />
            <span className="text-sm">{prompt.name}</span>
          </label>
        ))}
      </div>
    </div>
	);
};

export default RadioPrompts;

