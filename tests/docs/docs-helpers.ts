import { expect, test, type Locator } from "@playwright/test"
import { existsSync, readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
const folders = ["react", "vue", "web", "svelte", "solid"]

// The folder a framework's docs keep a section in: React's utilities are hooks.
const docsFolder = (framework: string, section: string) =>
  section === "utilities" && framework === "react" ? "hooks" : section

type Check = (preview: Locator, framework: string) => Promise<void>

// Types into a text field and checks it kept the value.
const fill =
  (name: string | RegExp, value: string): Check =>
  async (preview) => {
    const box = preview.getByRole("textbox", { name })
    await box.fill(value)
    await expect(box).toHaveValue(value)
  }

// Types into a search field, found by its label.
const search =
  (name: string): Check =>
  async (preview) => {
    const box = preview.getByLabel(name, { exact: true })
    await box.fill("shoes")
    await expect(box).toHaveValue("shoes")
  }

// Checks a text field is there, by its name.
const shows =
  (name: string | RegExp): Check =>
  async (preview) => {
    await expect(preview.getByRole("textbox", { name }).first()).toBeVisible()
  }

// Right-to-left examples stay in the example folders but are off their pages for now.
const pixel =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

const onPage = (example: string) => !/(^|-)rtl$/.test(example)

// Opens a docs page in every framework and runs each example's check, in
// page order. Every framework folder must have the same examples.
function testExamples(
  component: string,
  checks: Record<string, Check>,
  section = "components",
  fixtures = Object.keys(checks),
) {
  const order = Object.keys(checks).filter(onPage)
  const root = path.join(import.meta.dirname, "../../examples", component)
  const examplesIn = (folder: string) =>
    readdirSync(path.join(root, folder), { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name.replace(/\.\w+$/, ""))
  const has = (folder: string) => existsSync(path.join(root, folder))

  for (const framework of frameworks) {
    test(`every ${component} example works in ${framework}`, async ({ page }) => {
      // Svelte examples land component by component. A component without them
      // skips its Svelte test, and the folder comparison, until they do.
      test.skip(framework === "svelte" && !has("svelte"), `${component} has no Svelte examples yet`)
      const errors: string[] = []
      page.on("pageerror", (error) => errors.push(error.message))
      page.on("console", (message) => {
        // Vue warns in development when its compile-time flags aren't set.
        if (message.type() === "error" || /^Feature flags? __VUE_/.test(message.text()))
          errors.push(message.text())
      })
      // Examples show GitHub avatars. A local image stands in, so the specs need no network.
      await page.route(/^https:\/\/github\.com\/[\w-]+\.png/, (route) =>
        route.fulfill({ contentType: "image/png", body: Buffer.from(pixel, "base64") }),
      )
      await page.goto(`/docs/${framework}/${docsFolder(framework, section)}/${component}`)
      const previews = page.locator("[data-example]")
      await expect(previews).toHaveCount(order.length)
      for (const folder of folders.filter(has))
        expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())

      for (const [index, name] of order.entries()) {
        await test.step(name, () => checks[name](previews.nth(index), framework))
      }

      expect(errors).toEqual([])
    })
  }
}

export { type Check, docsFolder, fill, frameworks, onPage, search, shows, testExamples }
