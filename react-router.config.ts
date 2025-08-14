import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // async prerender() {
  //   return [
  //     "/",
  //     "/docs/toc",
  //     "/docs/get-started",
  //     "/docs/concept",
  //     "/docs/cli",
  //     "/docs/features",
  //   ];
  // },
} satisfies Config;
