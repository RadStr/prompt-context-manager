import { CHATBOT_SPECIFICS, ChatbotType, getChatbotTypeFromUrl } from "./exports/chatbot-pages-specifics";
import { BrowserMessageType } from "./model/browser-message-types";
import type { Prompt } from "./store/store-iface";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.info("Content script loaded.");
    // The issue is that the extensions is a popup/sidepanel and does not run in the main document. So we have to access it like this
    // Either like this through message, or I would need to inject a script, which is slightly aggressive from user perspective.
    //  Not sure if I would trust such extension.
    // The script would then be in the export and would look like the commented code defiend in the chatbot-window-export.ts file.

    browser.runtime.onMessage.addListener((message: BrowserMessageType, sender: globalThis.Browser.runtime.MessageSender, sendResponse: (response?: any) => void) => {
      return browserListenerWrapper(message, sender, sendResponse);
    });
    //   if (message.type === "APPEND_PROMPT" || message.type === "APPEND_AND_SEND_PROMPT") {
    //     let chatbotType: ChatbotType;
    //     try {
    //       chatbotType = getChatbotTypeFromUrl(window.location.href);
    //     }
    //     catch (e) {
    //       return Promise.resolve({ error: "unsupported chatbot page" });
    //     }

    //     const chatbotSpecifics = CHATBOT_SPECIFICS[chatbotType];
    // const textArea = document.querySelector(chatbotSpecifics.promptSelector);
    // return {
    //   text: textArea?.textContent,
    // };
    //     // const chatbotSpecifics = CHATBOT_SPECIFICS[chatbotType];
    //     // const textArea = document.querySelector(chatbotSpecifics.promptSelector);
    //     // const emptyLine = document.createElement("p");
    //     // const paragraph = document.createElement("p");
    //     // paragraph.textContent = message.promptText;
    //     // textArea?.appendChild(emptyLine);
    //     // textArea?.appendChild(paragraph);

    //     // return new Promise(requestAnimationFrame).then(() => {
    //     //   if (message.type === "APPEND_AND_SEND_PROMPT") {
    //     //     // We cannot click the button in instant, but have to wait for the next frame, since the button does not appear directly after adding the DOM but in next frame.
    //     //     const submitButton = document.querySelector(chatbotSpecifics.submitButtonSelector);
    //     //     console.info({submitButton});
    //     //     submitButton?.click();
    //     //   }
    //     //   return {
    //     //     text: textArea?.textContent,
    //     //   }
    //     // });
    //   }
    // });
  }
});


// function xdd(message: BrowserMessageType) {
//   if (message.type === "GET_CURRENT_CHATBOT_PROMPT") {
//     const chatbotSpecifics = CHATBOT_SPECIFICS[chatbotType];
//     const textArea = document.querySelector(chatbotSpecifics.promptSelector);
//     return {
//       text: textArea?.textContent,
//     };
//   }
// }

/**
 * Slightly modified type that comes into addListener method (difference is the is not message: any and it chat chatbotType)
 */
type BrowserListener = (chatbotType: ChatbotType, message: BrowserMessageType, sender: globalThis.Browser.runtime.MessageSender, sendResponse: (response?: any) => void) => void;

function browserListenerWrapper(message: BrowserMessageType, sender: globalThis.Browser.runtime.MessageSender, sendResponse: (response?: any) => void) {
  console.info({message});
  console.info("window.location.href:", window.location.href);

  let chatbotType: ChatbotType;
  try {
    chatbotType = getChatbotTypeFromUrl(window.location.href);
  }
  catch (e) {
    return Promise.resolve({ error: "unsupported chatbot page" });
  }

  let browserListener: BrowserListener;
  if (message.type === "APPEND_PROMPT" || message.type === "APPEND_AND_SEND_PROMPT" || message.type === "APPEND_WITH_PREFIXED_EMPTY_LINE" || message.type === "APPEND_WITH_SUFFIXED_EMPTY_LINE") {
    browserListener = appendToChat;
  }
  else if (message.type === "GET_CURRENT_CHATBOT_PROMPT") {
    browserListener = getCurrentChatbotPrompt;
  }
  else {
    throw new Error("Unknown message type: " + message.type);
  }

  return browserListener(chatbotType, message, sender, sendResponse);
}

async function getCurrentChatbotPrompt(chatbotType: ChatbotType) {
  const chatbotSpecifics = CHATBOT_SPECIFICS[chatbotType];
  const textArea = document.querySelector(chatbotSpecifics.promptSelector);
  return {
    text: textArea?.textContent,
  };
}


async function appendToChat(chatbotType: ChatbotType, message: BrowserMessageType) {
  const chatbotSpecifics = CHATBOT_SPECIFICS[chatbotType];
  const textArea = document.querySelector(chatbotSpecifics.promptSelector);
  const paragraph = document.createElement("p");
  if (message.type === "APPEND_WITH_PREFIXED_EMPTY_LINE") {
    const emptyLine = document.createElement("p");
    textArea?.appendChild(emptyLine);
  }

  paragraph.textContent = message.promptText;
  textArea?.appendChild(paragraph);
  if (message.type === "APPEND_WITH_SUFFIXED_EMPTY_LINE") {
    const emptyLine = document.createElement("p");
    textArea?.appendChild(emptyLine);
  }

  return await new Promise(requestAnimationFrame).then(() => {
    if (message.type === "APPEND_AND_SEND_PROMPT") {
      // We cannot click the button in instant, but have to wait for the next frame, since the button does not appear directly after adding the DOM but in next frame.
      const submitButton = document.querySelector(chatbotSpecifics.submitButtonSelector);
      console.info({submitButton});
      submitButton?.click();
    }
    return {
      text: textArea?.textContent,
    }
  });
}
