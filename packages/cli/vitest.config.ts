import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "../../vitest.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      name: "cli",
      environment: "node",
      setupFiles: ["./test-setup.ts"],
    },
  })
);
