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
    route("home", "routes/home.tsx"),
    route("search", "routes/search/index.tsx"),
    route("knowde/:id", "routes/knowde/detail/index.tsx"),
  ]),

  layout("layouts/DocumentLayout.tsx", [
    route("docs", "routes/docs/index.tsx"),
    route("docs/get-started", "routes/docs/get-started.mdx"),
    route("docs/concept", "routes/docs/concept.mdx"),
    route("docs/cli", "routes/docs/cli.mdx"),
    route("docs/features", "routes/docs/features.mdx"),
  ]),

  // route("login", "routes/Login/index.tsx"),
  // route("auth/google/callback", "routes/auth/google/callback.tsx"),
] satisfies RouteConfig;

// export async function createRoutesFromConfig(config: RouteConfig) {
//   const resolvedConfig= config instanceof Promise ? await config : config;
//   return resolvedConfig.map((item) => {
//
//     if (item.type === 'layout') { // @react-router/dev/routes の実際の型に合わせる
//       const LayoutComponent = componentMap[item.componentPath];
//       if (!LayoutComponent) {
//         console.warn(`Layout component not found for path: ${item.componentPath}`);
//         return null;
//       }
//       return (
//         <Route key={item.path} path={item.path || '/'} element={<LayoutComponent />}>
//           {item.children && item.children.length > 0 && createRoutesFromConfig(item.children)}
//         </Route>
//       );
//     }
//     // route 関数で生成されたルートの場合
//     else if (item.type === 'route') { // @react-router/dev/routes の実際の型に合わせる
//       const PageComponent = componentMap[item.componentPath];
//       if (!PageComponent) {
//         console.warn(`Page component not found for path: ${item.componentPath}`);
//         return null;
//       }
//       return <Route key={item.path} path={item.path} element={<PageComponent />} />;
//     }
//     // index 関数で生成されたルートの場合
//     else if (item.type === 'index') { // @react-router/dev/routes の実際の型に合わせる
//       const PageComponent = componentMap[item.componentPath];
//       if (!PageComponent) {
//         console.warn(`Index component not found for path: ${item.componentPath}`);
//         return null;
//       }
//       return <Route key="index" index element={<PageComponent />} />;
//     }
//     return null;
//   }).filter(Boolean); // null を除去
// };
//
