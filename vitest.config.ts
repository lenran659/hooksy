import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@hooksy/core": resolve(__dirname, "packages/core/src"),
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./packages/core/tests/setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
        include: [
            "packages/core/tests/**/*.test.ts",
            "packages/core/tests/**/*.spec.ts",
        ],
        exclude: ["**/node_modules/**", "**/dist/**"],
    },
});
