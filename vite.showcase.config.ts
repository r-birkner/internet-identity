import {defineConfig, type UserConfig} from "vite";
import { viteDefaultConfig } from "./vite.config";

// https://vitejs.dev/config/
export default defineConfig((config: UserConfig) => {
  const defaultConfig = viteDefaultConfig(config);
  const {build} = defaultConfig;

  return {
    ...defaultConfig,
    root: "src/showcase",
    build: {
      ...build,
      outDir: "../../showcase",
    }
  }
});
