import { PromptMessageType } from "../model/browser-message-types";
import { PROMPT_TYPE_TO_NAME } from "../model/prompt-types";
import { Prompt } from "../store/store-iface";

export interface Export {
  exportPrompt(prompt: Prompt, exportType: PromptMessageType): Promise<string | null>;
  exportText(text: string, exportType: PromptMessageType): Promise<string | null>;
}

export function createExportText(prompt: Prompt): string {
  let text: string;
  if (prompt.promptType === "custom") {
    text = prompt.text;
  }
  else {
    text = `${PROMPT_TYPE_TO_NAME[prompt.promptType]}: ${prompt.text}`;
  }
  return text;
}