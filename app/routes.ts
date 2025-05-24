import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("search", "routes/search/index.tsx"),
  route("login", "routes/Login/index.tsx"),
  route("auth/google/callback", "routes/auth/google/callback.tsx"),
  route("knowde/:id", "routes/knowde/detail/index.tsx"),
] satisfies RouteConfig;
