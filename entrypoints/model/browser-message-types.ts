export type PromptMessageType = "APPEND_PROMPT" |
  "APPEND_WITH_PREFIXED_EMPTY_LINE" |
  "APPEND_WITH_SUFFIXED_EMPTY_LINE" |
  "APPEND_AND_SEND_PROMPT" |
  "GET_CURRENT_CHATBOT_PROMPT";

export type BrowserMessageType = {
  type: PromptMessageType,
  promptText: string,
}
