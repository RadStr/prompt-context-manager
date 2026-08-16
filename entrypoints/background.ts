import { browser } from "wxt/browser";
import { myNpmLog } from "my-npm-log-to-learn-npm-publishing";

// Not necessary .. I took it from  https://github.com/wxt-dev/examples/blob/main/examples/side-panel/entrypoints/background.ts
// Same for the bottom part
// interface BrowserWithSidebar {
//   sidebarAction?: {
//     toggle(): Promise<void>;
//   };
// }

export default defineBackground(() => {
  // TODO: Idk if it is better to concat the defaults with user defined ones, or just have the the defaults as user-defined ones
  // browser.runtime.onInstalled.addListener((details) => {
  //   if (details.reason === "install") {
  //     storeDefaultPrompts();
  //   }
  // });

  myNpmLog("Hello background!", { id: browser.runtime.id });
  //
  // if (browser.sidePanel) {
  //   browser.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  // } else {
  //   const { sidebarAction } = browser as typeof browser & BrowserWithSidebar;
  //   if (sidebarAction) {
  //     browser.browserAction.onClicked.addListener(() => sidebarAction.toggle());
  //   }
  // }
});
