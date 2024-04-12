import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VitePluginSimpleMock from "../lib/index";
import mock from "./mock/index";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePluginSimpleMock(mock, {
      proxy: [/^\/api\//, /^\/oapi\//],
      ignore: [/^\/api\/ignore\//],
    }),
  ],
});
