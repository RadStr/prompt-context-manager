import React, { useState } from "react";
import PromptManipulation from "./tabs/create-prompt-tab/prompt-manipulation";
import BasePrompts from "./tabs/base-prompts-tab/base-prompts";
import CustomPrompts from "./tabs/custom-prompts-tab/custom-prompts";
import TemplatePrompts from "./tabs/prompt-templates-tab/template-prompts";
import { getPromptStore } from "../store/local-browser-store";

const store = getPromptStore();

type ViewTypes = "add" | "base" | "custom" | "template";

type PromptTabProps = {
  currentlyOpenedView: ViewTypes;
  setView: React.Dispatch<React.SetStateAction<ViewTypes>>;
  representedView: ViewTypes;
  label: string;
  title: string;
};

function PromptTab({ currentlyOpenedView: view, setView, representedView: target, label, title }: PromptTabProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={() => setView(target)}
      aria-pressed={view === target}
      className={`px-3 py-1 text-sm rounded border transition ${
        view === target
          ? "bg-slate-200 border-slate-400"
          : "bg-white border-slate-300 hover:bg-slate-100"
      }`}
    >
      {label}
    </button>
  );
}

export function Menu() {
  const [view, setView] = useState<ViewTypes>("add");
  // TODO: It seems to not be achieveable but take a look at minimazation expanding later
  // const [isMinimized, setIsMinimized] = useState<boolean>(true);

  return (
    <div className="p-3 min-w-[520px] min-h-[460px] box-border">
      {/* <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <button
          type="button"
          onClick={() => setIsMinimized(v => !v)}
          className="px-3 py-1 text-sm rounded border transition bg-white border-slate-300 hover:bg-slate-100"
        >
          {isMinimized ? "Expand sidepanel" : "Minimize sidepanel"}
        </button>
      </div> */}
      <nav className="space-y-2 mb-3">
        <div className="flex flex-wrap gap-2">
          <PromptTab currentlyOpenedView={view} setView={setView} representedView="add" label="➕" title="Add Prompts" />
          <PromptTab currentlyOpenedView={view} setView={setView} representedView="base" label="🧱" title="Base Prompts" />
          <PromptTab currentlyOpenedView={view} setView={setView} representedView="custom" label="🎨" title="Custom Prompts" />
          {/* TODO: Disabled for now - I first have to figure out whether I will use this software */}
          {/* <PromptTab currentlyOpenedView={view} setView={setView} representedView="template" label="📋" title="Template Prompts" /> */}
        </div>
      </nav>

      <div>
        {chooseShownView(view)}
      </div>
    </div>
  );
}

function chooseShownView(view: ViewTypes) {
  switch (view) {
    case "add":
      return (
        <PromptManipulation
          dialogTitle="Add Prompt"
          data={null}
          actions={{
            onCancel: () => {},
            onSave: (prompt) => store.store(prompt.id, prompt),
          }}
        />
      );
    case "base":
      return <BasePrompts />;
    case "custom":
      return <CustomPrompts />;
    case "template":
      return <TemplatePrompts />;
  }
}

export default Menu;
