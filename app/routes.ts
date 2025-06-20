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
  layout("layouts/GuestLayout/index.tsx", [
    index("routes/docs/LandingPage.tsx"),
    route("search", "routes/search/index.tsx"),
    route("knowde/:id", "routes/knowde/detail/index.tsx"),
  ]),

  layout("layouts/DocumentLayout/index.tsx", [
    route("docs/toc", "routes/docs/toc.tsx"),
    route("docs/get-started", "routes/docs/get-started.mdx"),
    route("docs/concept", "routes/docs/concept.mdx"),
    route("docs/cli", "routes/docs/cli.mdx"),
    route("docs/features", "routes/docs/features.mdx"),
  ]),

  route("register", "routes/user/register.tsx"),
  route("login", "routes/user/login.tsx"),
  layout("layouts/UserLayout/index.tsx", [route("home", "routes/home.tsx")]),
  // route("login", "routes/Login/index.tsx"),
  // route("auth/google/callback", "routes/auth/google/callback.tsx"),
  route("google/authorize", "routes/sso/google/authorize.ts"),
] satisfies RouteConfig;
