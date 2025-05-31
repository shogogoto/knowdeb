import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    output: {
      mode: "tags-split",
      target: "./app/generated",
      baseUrl: "https://knowde.onrender.com",
      client: "swr",
      httpClient: "fetch",
      mock: true,
    },
    input: {
      target: "http://localhost:8000/openapi.json",
    },
    hooks: {
      afterAllFilesWrite: "biome check --fix --unsafe",
    },
  },
  petstoreZod: {
    input: {
      target: "http://localhost:8000/openapi.json",
    },
    output: {
      mode: "tags-split",
      client: "zod",
      target: "./app/generated",
      fileExtension: ".zod.ts",
      biome: true,
    },
  },
});
