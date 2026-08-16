export type ChatbotType = "OPENAI_CHATGPT";

export const CHATBOT_SPECIFICS: Record<ChatbotType, any> = {
  "OPENAI_CHATGPT": {
    "name": "OpenAI ChatGPT",
    "url": "https://chat.openai.com/chat",
    "promptSelector": "#prompt-textarea",
    "submitButtonSelector": "#composer-submit-button",
  },
};

const CHATBOT_URLS: Record<ChatbotType, string> = {
  "OPENAI_CHATGPT": "chatgpt.com",
}

export function tryGetChatbotTypeFromUrl(url: string): ChatbotType | null {
  for (const [type, domain] of Object.entries(CHATBOT_URLS)) {
    if (url.includes(domain)) {
      return type as ChatbotType;
    }
  }
  return null;
}

/**
 * Same as {@link tryGetChatbotTypeFromUrl} but throws error/exception instead of simply returning null.
 *  The idea is that this should not happen so often so try should be slightly less expensive than if.
 */
export function getChatbotTypeFromUrl(url: string): ChatbotType {
  for (const [type, domain] of Object.entries(CHATBOT_URLS)) {
    if (url.includes(domain)) {
      return type as ChatbotType;
    }
  }

  console.error(`Could not determine chatbot type from the provided url: ${url}`);
  throw new Error(`Could not determine chatbot type from the provided url: ${url}`);
}
