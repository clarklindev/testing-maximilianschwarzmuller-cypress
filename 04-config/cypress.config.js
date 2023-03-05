import { defineConfig } from "cypress";

export default defineConfig({
  // video: true,
  // videosFolder: '',
  // videoCompression: '',
  // screenshotOnRunFailure: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
