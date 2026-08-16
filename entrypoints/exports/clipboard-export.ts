import { PromptMessageType } from "../model/browser-message-types";
import { Prompt } from "../store/store-iface";
import { createExportText, Export } from "./export-iface";

export class ClipboardExport implements Export {
  async exportPrompt(prompt: Prompt, exportType: PromptMessageType): Promise<string | null> {
    return copyToClipboard(createExportText(prompt), exportType);
  }
  async exportText(text: string, exportType: PromptMessageType): Promise<string | null> {
    return copyToClipboard(text, exportType);
  }
}

async function copyToClipboard(text: string, exportType: PromptMessageType): Promise<string | null> {
  if (exportType === "GET_CURRENT_CHATBOT_PROMPT") {
    return navigator.clipboard.readText();
  }

  try {
    if (exportType === "APPEND_WITH_PREFIXED_EMPTY_LINE") {
      await navigator.clipboard.writeText("");
    }
    await navigator.clipboard.writeText(text);
    if (exportType === "APPEND_WITH_SUFFIXED_EMPTY_LINE") {
      await navigator.clipboard.writeText("");
    }
    console.log("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
  }

  return navigator.clipboard.readText();
}
