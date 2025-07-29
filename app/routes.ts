import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

// Add any necessary exports for server rendering
export const config = {
  hydrate: true,
};

export default [
  layout("layouts/SidebarLayout.tsx", [
    // Docs
    index("routes/docs/LandingPage.tsx"),
    route("docs/toc", "routes/docs/toc.tsx"),
    route("docs/get-started", "routes/docs/get-started.mdx"),
    route("docs/concept", "routes/docs/concept.mdx"),
    route("docs/cli", "routes/docs/cli.mdx"),
    route("docs/features", "routes/docs/features.mdx"),

    route("search", "routes/search/index.tsx"),
    route("knowde/:id", "routes/knowde/detail/index.tsx"),
    route("register", "routes/user/register.tsx"),
    route("login", "routes/user/login.tsx"),

    route("home", "routes/home.tsx"),
    route("user/edit", "routes/user/edit.tsx"),
    route("user/:userId", "routes/user/search.tsx"),
  ]),

  route("/user/signUpload", "routes/user/signUpload.ts"),
  route("/user/deleteImage", "routes/user/deleteImage.ts"),

  route("google/authorize", "routes/sso/google/authorize.tsx"),
  route("google/callback", "routes/sso/google/callback.tsx"),
] satisfies RouteConfig;
