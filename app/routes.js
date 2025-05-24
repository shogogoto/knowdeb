"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var routes_1 = require("@react-router/dev/routes");
exports.default = [
    (0, routes_1.index)("routes/home.tsx"),
    (0, routes_1.route)("search", "routes/search/index.tsx"),
    (0, routes_1.route)("login", "routes/Login/index.tsx"),
    (0, routes_1.route)("auth/google/callback", "routes/auth/google/callback.tsx"),
    (0, routes_1.route)("knowde/:id", "routes/knowde/detail/index.tsx"),
];
