import { BrowserMessageType, PromptMessageType } from "../model/browser-message-types";
import { Prompt } from "../store/store-iface";
import { getChatbotTypeFromUrl } from "./chatbot-pages-specifics";
import { createExportText, Export } from "./export-iface";

export class ChatbotWindowExport implements Export {
  async exportText(text: string, exportType: PromptMessageType): Promise<string | null> {
    return await this.exportInternal(text, exportType);
  }


  async exportPrompt(prompt: Prompt, exportType: PromptMessageType): Promise<string | null> {
    return await this.exportInternal(createExportText(prompt), exportType);
  }

  private async exportInternal(text: string, promptMessageType: PromptMessageType): Promise<string | null> {
         // Does not work ... re.scripting is undefined, but I set permissions: ["scripting"] in wxt.config.ts ... so I guess that maybe it is not possible to do like this? Try later - TODO:
      // const [tab] = await browser.tabs.query({
      //   active: true,
      //   currentWindow: true,
      // });
      // const result = await browser.scripting.executeScript({
      //   target: { tabId: tab.id! },
      //   func: () => {
      //     console.info("The prompt text,, we are currently in executeScript of the browser:", prompt.text);
      //     return document.title;
      //   },
      // });
      // console.log(result[0].result);


    const wrapper = document.getElementById("prompt-textarea");
    console.info("ChatbotWindowExport: found element with id 'prompt-textarea':", document);

    if (!wrapper) {
      console.warn("ChatbotWindowExport: element with id 'prompt-textarea' not found.");
      // return;
    }

    // const [tab] = await browser.tabs.query({
    //   active: true,
    //   currentWindow: true,
    // });

    // await browser.scripting.executeScript({
    //   target: { tabId: tab.id! },
    //   func: () => {
    //     const wrapper = document.getElementById("prompt-textarea");
    //     console.info("ChatbotWindowExport: found element with id 'prompt-textarea':", wrapper);
    //     const el = document.querySelector("#my-element");
    //     return el?.textContent;
    //   },
    // });

    // const currentContent = wrapper.textContent ?? "";
    // console.log("Existing prompt-textarea content:", currentContent);

    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab?.id) {
        console.error("ChatbotWindowExport: no active tab found");
        return null;
      }

      const message: BrowserMessageType = {
        type: promptMessageType,
        promptText: text,
      };

      const response = await browser.tabs.sendMessage(tab.id, message);

      console.info("ChatbotWindowExport: GET_ELEMENT response", response);
      return response.text;
    } catch (error) {
      console.error("ChatbotWindowExport: failed to send message", error);
    }

    return null;

    // const paragraph = document.createElement("p");
    // paragraph.textContent = prompt.text;
    // wrapper.appendChild(paragraph);
  }

}
