import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["lib/index.ts"],
  format: ["cjs", "esm"],
  dts: {
    only: true,
  },
  splitting: false,
  clean: true,
});
