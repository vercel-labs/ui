import { expect } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

// A `#something` link rewrites the docs' URL when followed, so these demos use a bare
// `#`, which the preview ignores. Navigation Menu's router example keeps hash routes,
// and pages whose links are hash routes on purpose, like Tabs', aren't listed.
const root = path.join(import.meta.dirname, "../../examples/components")
const components = ["hover-card", "navigation-menu", "carousel", "dialog", "drawer", "popover", "tooltip"]
const hashLink = /href(?:=|: ?|", )["'`{]*#[^"'`]/

test("no example links to a hash on the docs page", () => {
  const found: string[] = []
  for (const component of components) {
    for (const folder of ["react", "vue", "svelte", "web", "solid"]) {
      const dir = path.join(root, component, folder)
      for (const file of readdirSync(dir)) {
        if (component === "navigation-menu" && file.startsWith("link-component.")) continue
        const source = readFileSync(path.join(dir, file), "utf8")
        source.split("\n").forEach((line, index) => {
          if (hashLink.test(line)) found.push(`${component}/${folder}/${file}:${index + 1}`)
        })
      }
    }
  }
  expect(found).toEqual([])
})
