import { defineConfig } from "cypress";
const allureWriter = require('@shelex/cypress-allure-plugin/writer')

export default defineConfig({
  // allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      allureWriter(on, config);
      return config;
    },
    baseUrl: 'http://localhost:5173'

  },
});
