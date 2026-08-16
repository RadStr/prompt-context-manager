// TODO: Maybe later ... just some AI generated prototype

import React, { useMemo, useState } from "react";

type TemplateOption = {
  id: string;
  label: string;
  description: string;
  template: string;
};

type TemplateValueMap = Record<string, string>;

type TemplatePart =
  | { type: "text"; content: string }
  | { type: "placeholder"; key: string; display: string };

type PlaceholderEditState = {
  key: string;
  currentValue: string;
  open: boolean;
};

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "welcome",
    label: "Welcome Message",
    description: "Build a friendly onboarding prompt.",
    template: "Write a welcome message for {{customerName}} that highlights {{productName}} and asks about {{goal}}.",
  },
  {
    id: "summary",
    label: "Short Summary",
    description: "Create a concise summary with dynamic fields.",
    template: "Summarize the latest update for {{projectName}} including {{feature}} and the next steps.",
  },
  {
    id: "email",
    label: "Email Draft",
    description: "Generate a draft email with replaceable sections.",
    template: "Compose an email to {{recipientName}} about {{topic}} and include a polite call to action.",
  },
];

function parseTemplate(template: string, values: TemplateValueMap): TemplatePart[] {
  const parts: TemplatePart[] = [];
  const matcher = /\{\{\s*([\w]+)\s*\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(template)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: template.slice(lastIndex, match.index) });
    }

    const key = match[1];
    parts.push({
      type: "placeholder",
      key,
      display: values[key] || key,
    });

    lastIndex = matcher.lastIndex;
  }

  if (lastIndex < template.length) {
    parts.push({ type: "text", content: template.slice(lastIndex) });
  }

  return parts;
}

function InteractivePromptTextArea({
  template,
  values,
  onPartClick,
}: {
  template: string;
  values: TemplateValueMap;
  onPartClick: (placeholderKey: string) => void;
}) {
  const parts = useMemo(() => parseTemplate(template, values), [template, values]);

  return (
    <div className="rounded-xl border border-slate-300 bg-slate-50 p-4 text-slate-900 shadow-sm">
      <div className="mb-2 text-sm text-slate-500">Click a highlighted part to edit it.</div>
      <div className="min-h-[160px] whitespace-pre-wrap text-base leading-7">
        {parts.map((part, index) => {
          if (part.type === "text") {
            return <span key={`text-${index}`}>{part.content}</span>;
          }

          return (
            <button
              key={`placeholder-${part.key}-${index}`}
              type="button"
              onClick={() => onPartClick(part.key)}
              className="rounded-md bg-amber-100 px-2 py-1 text-amber-900 transition hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {part.display}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlaceholderEditDialog({
  open,
  placeholderKey,
  initialValue,
  onAccept,
  onClose,
}: {
  open: boolean;
  placeholderKey: string;
  initialValue: string;
  onAccept: (value: string) => void;
  onClose: () => void;
}) {
  const [draftValue, setDraftValue] = useState(initialValue);

  React.useEffect(() => {
    setDraftValue(initialValue);
  }, [initialValue, placeholderKey]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-2 text-xl font-semibold text-slate-900">Edit “{placeholderKey}”</h3>
        <p className="mb-4 text-sm text-slate-600">Change the selected placeholder text and accept to update the prompt.</p>
        <textarea
          value={draftValue}
          onChange={(event) => setDraftValue(event.target.value)}
          rows={5}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onAccept(draftValue)}
            className="rounded-xl bg-slate-900 px-4 py-2 text-white transition hover:bg-slate-700"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function TemplatePrompts() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(TEMPLATE_OPTIONS[0].id);
  const [values, setValues] = useState<TemplateValueMap>({});
  const [editState, setEditState] = useState<PlaceholderEditState>({ key: "", currentValue: "", open: false });

  const selectedTemplate = TEMPLATE_OPTIONS.find((option) => option.id === selectedTemplateId) ?? TEMPLATE_OPTIONS[0];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setValues({});
    setEditState({ key: "", currentValue: "", open: false });
  };

  const handlePartClick = (placeholderKey: string) => {
    setEditState({
      key: placeholderKey,
      currentValue: values[placeholderKey] || placeholderKey,
      open: true,
    });
  };

  const handleDialogAccept = (updatedValue: string) => {
    setValues((previous) => ({ ...previous, [editState.key]: updatedValue }));
    setEditState((previous) => ({ ...previous, open: false }));
  };

  const handleDialogClose = () => {
    setEditState((previous) => ({ ...previous, open: false }));
  };

  const displayText = useMemo(() => {
    return selectedTemplate.template.replace(/\{\{\s*([\w]+)\s*\}\}/g, (_, key) => values[key] || key);
  }, [selectedTemplate.template, values]);

  return (
    <div className="flex min-h-[520px] flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-semibold text-slate-900">Template Prompts</div>
        <div className="text-sm text-slate-500">Choose a prompt template and click a highlighted part to update it.</div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 text-sm font-medium text-slate-700">Template list</div>
          <div className="space-y-2">
            {TEMPLATE_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTemplateSelect(item.id)}
                className={`block w-full rounded-2xl border px-4 py-3 text-left transition ${
                  item.id === selectedTemplateId
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                <div className="font-semibold">{item.label}</div>
                <div className="mt-1 text-sm text-slate-500">{item.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-medium text-slate-700">Selected template</div>
                <div className="text-xs text-slate-500">{selectedTemplate.label}</div>
              </div>
              <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {Object.keys(values).length} edited part{Object.keys(values).length === 1 ? "" : "s"}
              </div>
            </div>
            <InteractivePromptTextArea
              template={selectedTemplate.template}
              values={values}
              onPartClick={handlePartClick}
            />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 text-sm font-medium text-slate-700">Final prompt preview</div>
            <div className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
              {displayText}
            </div>
          </div>
        </div>
      </div>

      <PlaceholderEditDialog
        open={editState.open}
        placeholderKey={editState.key}
        initialValue={editState.currentValue}
        onAccept={handleDialogAccept}
        onClose={handleDialogClose}
      />
    </div>
  );
}

export default TemplatePrompts;
