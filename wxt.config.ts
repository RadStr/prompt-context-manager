import { defineConfig } from 'wxt';
import { browser } from "wxt/browser";
import tailwindcss from "@tailwindcss/vite";      // Comes from the first dependency in package.json

// See https://wxt.dev/api/config.html
export default defineConfig({
  browser: "firefox",
  modules: ["@wxt-dev/module-react"],
  permissions: ["tabs"],
  host_permissions: ["<all_urls>"],
  vite: () => ({
    plugins: [tailwindcss()],       // Needed for tailwind
  }),
  // Also not necessary for side panel (took it from https://github.com/wxt-dev/examples/blob/main/examples/side-panel/wxt.config.ts)
  // ...(browser === "firefox" && {
  //     browser_action: {
  //       default_title: "Toggle Side Panel",
  //     },
  //   }),
});
