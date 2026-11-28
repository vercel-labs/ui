import { configDefaults, defineConfig } from "vitest/config"

// The tests run as Angular's compiler emits them, which the `test` script
// does first. That output sits in node_modules, which Vitest leaves out.
export default defineConfig({
  test: {
    include: ["node_modules/.test/test/**/*.test.js"],
    exclude: configDefaults.exclude.filter(
      (pattern) => !pattern.includes("node_modules")
    ),
  },
})
