import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/** Synthetic careers-store benchmark, kept out of `npm test`: run with `npm run bench:careers`. */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("../../", import.meta.url)) },
  },
  test: {
    root: fileURLToPath(new URL("../../", import.meta.url)),
    environment: "node",
    include: ["tests/bench/**/*.bench.ts"],
    testTimeout: 600_000,
  },
});
