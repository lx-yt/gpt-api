import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint2";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    outDir: "dist",
    sourcemap: true,
    lib: {
      entry: "src/index.ts",
      name: "Package",
      fileName: "index",
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  plugins: [
    react(),
    eslint({
      cache: false,
      emitErrorAsWarning: true,
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    }),
    checker({ typescript: true }),
    dts({ rollupTypes: true }),
  ],
  server: {
    open: true,
    port: 3000,
  },
});
