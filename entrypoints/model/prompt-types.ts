export const PROMPT_TYPE_VALUES = ["role", "answer role", "tone", "length", "answer persona", "correctness", "format", "custom"] as const;
export type PromptType = typeof PROMPT_TYPE_VALUES[number];
export const PROMPT_TYPE_TO_NAME: Record<PromptType, string> = {
  "role": "Role",                   // Is the role of the AI that is for example, you are helping to me learn so do not provide solution
  "answer role": "Answer Role",     // Is the role of the user that is for example a beginner, or professional
  "tone": "Tone",                   // For example explain using simple terms
  "length": "Length",
  "answer persona": "Answer Persona", // For example Rambo, Patrick Bateman - uses phrases of the characters and so on
  "correctness": "Correctness",
  "format": "Format",
  "custom": "Custom"
};
