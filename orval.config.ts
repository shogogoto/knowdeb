import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    output: {
      mode: "tags-split",
      target: "./app/generated",
      baseUrl: "https://knowde.onrender.com",
      // baseUrl: "http://localhost:8000",
      // baseUrl: "https://toucan-renewing-jackal.ngrok-free.app",
      client: "swr",
      httpClient: "fetch",
      mock: true,
    },
    input: {
      target: "http://localhost:8000/openapi.json",
    },
    hooks: {
      afterAllFilesWrite: "npm run lint:fix",
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
