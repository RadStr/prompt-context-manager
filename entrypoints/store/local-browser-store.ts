import type { Prompt, PromptStore } from "./store-iface";

const STORAGE_PREFIX = "prompts_";

export class LocalPromptStore implements PromptStore {
  constructor() {
    // EMPTY
  }

  get(id: string): Prompt | null {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    return raw ? (JSON.parse(raw) as Prompt) : null;
  }

  store(id: string, prompt: Prompt): void {
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(prompt)  );
  }

  remove(id: string): void {
    localStorage.removeItem(STORAGE_PREFIX + id);
  }

  getAll(): Prompt[] {
    const prompts: Prompt[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw !== null) {
          prompts.push(JSON.parse(raw) as Prompt);
        }
      }
    }
    return prompts;
  }
}


/**
 * TODO: Ideally should come from configuration or something like that
 */
export function getPromptStore(): PromptStore {
  return new LocalPromptStore();
}
