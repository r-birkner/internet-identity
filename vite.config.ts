import { defineConfig, UserConfig } from "vite";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";
import { injectCanisterIdPlugin, stripInjectJsScript } from "./vite.plugins";
import { resolve } from "path";
import type { Plugin } from "rollup";
import viteCompression from "vite-plugin-compression";

export const viteDefaultConfig = ({ mode }: UserConfig): UserConfig => ({
  root: "src/frontend",
  envDir: "../../",
  resolve: {
    alias: {
      $assets: resolve(__dirname, "src/frontend/assets"),
      $app: resolve(__dirname, "src/frontend/src"),
      $generated: resolve(__dirname, "src/frontend/generated"),
    },
  },
  build: {
    outDir: "../../dist",
    emptyOutDir: true,
    rollupOptions: {
      plugins: [rollupNodePolyFill() as Plugin],
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
  plugins: [
    viteCompression(),
    [...(mode === "development" ? [injectCanisterIdPlugin()] : [])],
    [...(mode === "production" ? [stripInjectJsScript()] : [])],
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [NodeModulesPolyfillPlugin()],
    },
  },
});

// https://vitejs.dev/config/
export default defineConfig(viteDefaultConfig);
