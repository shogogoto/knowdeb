import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/MainLayout.tsx", [index("routes/docs/LandingPage.tsx")]),
  layout("layouts/SidebarLayout.tsx", [
    route("home", "routes/home.tsx"),
    route("search", "routes/search/index.tsx"),
    route("knowde/:id", "routes/knowde/detail/index.tsx"),
  ]),

  route("login", "routes/Login/index.tsx"),
  route("auth/google/callback", "routes/auth/google/callback.tsx"),
] satisfies RouteConfig;
