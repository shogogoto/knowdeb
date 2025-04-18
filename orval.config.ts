import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    output: {
      mode: "single",
      target: "./app/generated",
      baseUrl: "http://localhost:8000",
      client: "fetch",
      mock: true,
    },
    input: {
      target: "http://localhost:8000/openapi.json",
    },
    hooks: {
      afterAllFilesWrite: "biome check --fix --unsafe",
    },
  },
});
