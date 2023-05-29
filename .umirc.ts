import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "index" },
    { path: "/ws", component: "ws" },
    { path: "/sse", component: "sse" },
  ],
  npmClient: 'yarn',
});
