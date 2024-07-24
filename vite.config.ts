import { defineConfig, mergeConfig } from "vite";

// using relative path to avoid error: TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"
import baseConfig from "./node_modules/@lx-yt/vite-config-default/vite.config";
import reactConfig from "./node_modules/@lx-yt/vite-config-default/vite.config.react";

export default defineConfig(mergeConfig(baseConfig, reactConfig));
