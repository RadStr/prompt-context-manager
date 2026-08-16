import { Export } from "../exports/export-iface";
import { Prompt } from "../store/store-iface";
import { PromptMessageType } from "./browser-message-types";


export class PromptBuilder {
  private prompts: Prompt[] = [];

  addPrompt(prompt: Prompt): void {
    this.prompts.push(prompt);
  }

  clear(): void {
    this.prompts = [];
  }

  async export(exporter: Export, exportType: PromptMessageType): Promise<void> {
    const currentPrompt = await exporter.exportPrompt({} as Prompt, "GET_CURRENT_CHATBOT_PROMPT");      // TODO: A bit hacky
    const separator = "----------------------------------------";
    const initialText = "Now follows the list additional constraints on the answer. Each on a new line. Please, follow them.";

    if (!(currentPrompt !== null && currentPrompt.includes(separator) && currentPrompt.includes(initialText))) {
      await exporter.exportText(separator, "APPEND_WITH_PREFIXED_EMPTY_LINE");
      await exporter.exportText(initialText, "APPEND_WITH_SUFFIXED_EMPTY_LINE");
      // For some reason an empty string (empty paragraph) sends the prompt instead of just adding new line ... SO DO NOT USE THE FOLLOWING LINE
      // await exporter.exportText("", "APPEND_WITH_PREFIXED_EMPTY_LINE");

      for (const [index, prompt] of this.prompts.entries()) {
        const currentExportType = (index === this.prompts.length - 1) ? exportType : "APPEND_PROMPT";
        await exporter.exportPrompt(prompt, currentExportType);
      }
    }
  }
}
