import { PromptType } from "../model/prompt-types";
import { getPromptStore } from "./local-browser-store";
import { createUniqueId, LengthPrompt, Prompt } from "./store-iface";

// TODO: Could be further split by promptType into separate files, but since I am a single developer this is overkill.
const defaultPrompts: Record<string, Prompt> = {
  // Role
  "learning-but-no-solution": {
    id: createUniqueId(),
    name: "Learning but no solution",
    modificationDate: new Date().toISOString(),
    text: "You are helping me to learn. Tell me how to do things with sufficient examples but do not provide the whole solution. Unless explictly asked in subsequent request.",
    promptType: "role",
  },
  // length
  "one-sentence": {
    id: createUniqueId(),
    name: "One sentence",
    modificationDate: new Date().toISOString(),
    text: "The answer should be a single sentence.",
    promptType: "length",
  },
  "short": {
    id: createUniqueId(),
    name: "One paragraph",
    modificationDate: new Date().toISOString(),
    text: "The answer should be one paragraph long.",
    promptType: "length",
  },
  "moderate": {
    id: createUniqueId(),
    name: "Moderate",
    modificationDate: new Date().toISOString(),
    text: "The answer should be in moderate length.",
    promptType: "length",
  },
  "long": {
    id: createUniqueId(),
    name: "Detailed",
    modificationDate: new Date().toISOString(),
    text: "The answer should be detailed.",
    promptType: "length",
  },
  // Tone
  "linkedin-tone": {
    id: createUniqueId(),
    name: "Linkedin",
    modificationDate: new Date().toISOString(),
    text: "Answer using linkedin speech.",
    promptType: "tone",
  },
  "dota2-tone": {
    id: createUniqueId(),
    name: "Dota 2",
    modificationDate: new Date().toISOString(),
    text: "Answer using Dota 2 terms.",
    promptType: "tone",
  },
  // answer role
  "beginner": {
    id: createUniqueId(),
    name: "Beginner",
    modificationDate: new Date().toISOString(),
    text: "You are talking to a beginner in the topic. Try to explain it as simple as possible, even with possible simplifications. Provide easy to understand examples. Omit technical details, but point them out at the end that it is something the user can further dive into.",
    promptType: "answer role",
  },
  "intermediate": {
    id: createUniqueId(),
    name: "Intermediate",
    modificationDate: new Date().toISOString(),
    text: "You are talking to an intermediate in the topic. Try to explain it as simple as possible, but do not oversimplify things. Provide easy to understand examples. Explain technical details very briefly, also point them out at the end that it is something the user can further dive into.",
    promptType: "answer role",
  },
  "expert": {
    id: createUniqueId(),
    name: "Expert",
    modificationDate: new Date().toISOString(),
    text: "You are talking to an expert in the topic. You can use any terms from the topic, the user will understand them. Provide examples, they can be complicated but have to be relevant and explained in an understandable manner. Do not omit any important technical details. In the end provide possible furth areas to look into.",
    promptType: "answer role",
  },
  // answer persona
  "patrick-bateman": {
    id: createUniqueId(),
    name: "Patrick bateman",
    modificationDate: new Date().toISOString(),
    text: "Answer as if you were Patrick Bateman from the American Psycho.",
    promptType: "answer persona",
  },
  "homer-simpson": {
    id: createUniqueId(),
    name: "Homer Simpson",
    modificationDate: new Date().toISOString(),
    text: "Answer as if you were Homer Simpson from the Simpsons.",
    promptType: "answer persona",
  },
  // Correctness
  "fully-correct": {
    id: createUniqueId(),
    name: "Fully Correct",
    modificationDate: new Date().toISOString(),
    text: "To every claim you say provide a source. Mark everything as either coming from source or something you deduced from facts but is mostly correct or something that you are unsure about. Use the emojis '✅', '⚠️', '❌' to mark that.",
    promptType: "correctness",
  },
  "marking-correctness": {
    id: createUniqueId(),
    name: "Mark correctness",
    modificationDate: new Date().toISOString(),
    text: "Mark everything with percentage that signalizes how much is the specific information correct. 100% being completely correct (either comes from a source or known fact). 0% being you made it up.",
    promptType: "correctness",
  },
  // format
  "split-into-three": {
    id: createUniqueId(),
    name: "Split into three parts",
    modificationDate: new Date().toISOString(),
    text: "Split the answer into three sections with the following headers 1) Overall ideas 2) ideas shown with examples and more details 3) Deep-dive into technical details.",
    promptType: "format",
  },
  "only-code": {
    id: createUniqueId(),
    name: "Only code",
    modificationDate: new Date().toISOString(),
    text: "All the information should be present in the generated code block with the solution.",
    promptType: "format",
  },
};

const defaultPromptsAsArray = Object.values(defaultPrompts);
const defaultLengthPrompts = Object.values(defaultPrompts).filter((prompt) => prompt.promptType === "length");

// export function storeDefaultPrompts(): void {
//   const promptStore = getPromptStore();
//   for (const prompt of Object.values(defaultPrompts)) {
//     promptStore.store(prompt.id, prompt);
//   }
// }


export function concatWithDefaultPrompts(prompts: Prompt[], promptType: PromptType | "all") {
  if (promptType === "all") {
    return prompts.concat(defaultPromptsAsArray);
  }
  else {
    return prompts.concat(defaultPromptsAsArray.filter(p => p.promptType === promptType));
  }
}
