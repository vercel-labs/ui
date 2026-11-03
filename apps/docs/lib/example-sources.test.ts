import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import path from "node:path"
import { afterAll, beforeEach, expect, test, vi } from "vitest"
import { readExampleSources } from "./example-sources"
import { frameworkLlms } from "./llms"
import { pageMarkdown } from "./page-markdown"
import { repoRoot } from "./repo-root"

vi.mock("./repo-root", async () => {
  const { mkdtempSync } = await import("node:fs")
  const { tmpdir } = await import("node:os")
  const path = await import("node:path")
  return { repoRoot: mkdtempSync(path.join(tmpdir(), "ui-sdk-example-sources-")) }
})

const source = 'export const Example = () => <button className="rounded-lg">Save</button>'

function writeFiles(files: Record<string, string>, framework = "react") {
  const directory = path.join(repoRoot, "examples/components/button", framework)
  for (const [name, code] of Object.entries(files)) {
    const file = path.join(directory, name)
    mkdirSync(path.dirname(file), { recursive: true })
    writeFileSync(file, code)
  }
}

function writePage(attributes = "") {
  const file = path.join(repoRoot, "apps/docs/content/docs/react/components/button.mdx")
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(
    file,
    `---\ntitle: Button\n---\n\n<ComponentExample name="button/basic" caption="Press Save." ${attributes} />\n`,
  )
  return file
}

beforeEach(() => {
  rmSync(path.join(repoRoot, "examples"), { recursive: true, force: true })
})

afterAll(() => {
  rmSync(repoRoot, { recursive: true, force: true })
})

test("a missing example has no source", async () => {
  expect(await readExampleSources("button/missing", "react")).toBeNull()
})

test("an example returns its named source", async () => {
  writeFiles({ "basic.tsx": `${source}\n` })
  expect(await readExampleSources("button/basic", "react")).toEqual({
    files: [{ name: "basic.tsx", lang: "tsx", code: source }],
    log: false,
  })
})

test("web components read TypeScript from the web example folder", async () => {
  writeFiles({ "basic.ts": 'import "@ui-sdk/web/button"' }, "web")
  expect(await readExampleSources("button/basic", "web-components")).toEqual({
    files: [{ name: "basic.ts", lang: "ts", code: 'import "@ui-sdk/web/button"' }],
    log: false,
  })
})

test("Markdown includes the complete named source and caption, even when the preview hides code", async () => {
  writeFiles({ "basic.tsx": source })
  const markdown = await pageMarkdown(writePage("hideCode={true}"), "react", () => null)
  expect(markdown).toContain(`\`\`\`tsx title="basic.tsx"\n${source}`)
  expect(markdown).toContain("Press Save.")
  expect(markdown).not.toContain("<ComponentExample")
})

test("compact Markdown keeps the caption without expanding the example", async () => {
  writeFiles({ "basic.tsx": source })
  const markdown = await pageMarkdown(writePage(), "react", () => null, { compact: true })
  expect(markdown).toBe("# Button\n\nPress Save.\n")
})

test("Markdown keeps the caption when the example is missing", async () => {
  expect(await pageMarkdown(writePage(), "react", () => null)).toBe("# Button\n\nPress Save.\n")
})

test("shared guides keep captions and their inline code instead of expanding examples", async () => {
  writeFiles({ "basic.tsx": source })
  expect(await pageMarkdown(writePage(), undefined, () => null)).toBe("# Button\n\nPress Save.\n")
})

test("framework llms output reads imports without treating subfolders as source files", async () => {
  writeFiles({
    "basic.tsx": `import { Button } from "@ui-sdk/react/button"\n${source}`,
    "assets/notes.txt": "Example notes",
  })
  writePage()
  mkdirSync(path.join(repoRoot, "apps/docs/content/docs/react/hooks"), { recursive: true })
  const markdown = await frameworkLlms("react", ({ slugs }) => `/docs/${slugs.join("/")}`)
  expect(markdown).toContain("- [Button](/docs/react/components/button):")
  expect(markdown).toContain("Import from `@ui-sdk/react/button`.")
  expect(markdown).not.toContain("Example notes")
})

test("lean Markdown keeps the first example's classes and drops the rest", async () => {
  writeFiles({
    "basic.tsx": source,
    "outline.tsx":
      'export const Example = () => (\n  <button\n    className="rounded-lg border"\n    type="button"\n  >\n    Save\n  </button>\n)',
  })
  const file = writePage()
  writeFileSync(file, `${readFileSync(file, "utf8")}\n<ComponentExample name="button/outline" />\n`)
  const markdown = await pageMarkdown(file, "react", () => null, { lean: true })
  expect(markdown).toContain(source)
  expect(markdown).toContain('export const Example = () => (\n  <button type="button">\n    Save')
})

test("lean Markdown keeps a class list the code selects", async () => {
  writeFiles({
    "basic.tsx": source,
    "grid.tsx":
      'const grid = document.querySelector(".grid")\nexport const Example = () => <div className="grid gap-2" />',
  })
  const file = writePage()
  writeFileSync(file, `${readFileSync(file, "utf8")}\n<ComponentExample name="button/grid" />\n`)
  const markdown = await pageMarkdown(file, "react", () => null, { lean: true })
  expect(markdown).toContain('<div className="grid gap-2" />')
})
