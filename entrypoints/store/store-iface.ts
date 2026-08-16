import { PromptType } from "../model/prompt-types";

export interface Prompt {
  id: string;
  name: string;
  modificationDate: string;
  text: string;
  promptType: PromptType;      // TODO: Not sure if the PromptTemplate should be just different type here or completely different thing altogether
}

export interface LengthPrompt extends Prompt {
  promptType: "length";
}

type TemplatePartType = "text" | "placeholder";

export interface TemplatePart {
  text: string;
  templatePartType: TemplatePartType;
}

export interface TemplatePrompt extends Omit<Prompt, "text"> {
  templateParts: TemplatePart[];
}

export interface PromptStore {
  get(id: string): Prompt | null;
  getAll(): Prompt[];
  store(id: string, prompt: Prompt): void;
  remove(id: string): void;
}

export function createUniqueId(): string {
  return (crypto && typeof crypto.randomUUID === "function")
    ? crypto.randomUUID()
    : Date.now().toString();
}
