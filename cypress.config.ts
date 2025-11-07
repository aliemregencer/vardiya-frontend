import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
  e2e: {
    // Tüm .feature dosyalarını bul
    specPattern: "**/*.feature",
    // React uygulaması 3001 portunda çalışacak
    baseUrl: "http://localhost:5173",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      
      // Adım tanımlarının aranacağı yolu belirtiyoruz
      config.env.stepDefinitions = "cypress/e2e/**/*.ts";
      
      return config;
    },
  },
});