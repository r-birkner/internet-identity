import { defineConfig } from "vite";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import { injectCanisterIdPlugin } from "./vite.plugins";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  root: "src/frontend",
  envDir: "../../",
  resolve: {
    alias: {
      $assets: resolve(__dirname, "src/frontend/assets"),
    },
  },
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  plugins:
    process.env.NODE_ENV === "production" ? [] : [injectCanisterIdPlugin()],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [NodeModulesPolyfillPlugin()],
    },
  },
});
