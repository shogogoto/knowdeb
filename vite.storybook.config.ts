import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const envWithVitePrefix = Object.fromEntries(
    Object.entries(env)
      .filter(([key]) => key.startsWith("VITE_") || key === "STORYBOOK")
      .map(([key, val]) => [`import.meta.env.${key}`, `"${val}"`]),
  );

  return {
    plugins: [tsconfigPaths(), tailwindcss()],
    define: envWithVitePrefix,
  };
});
