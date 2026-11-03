import { expect, test, type Locator } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(import.meta.dirname, "../../examples/components/file-input", folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the page.
const order = [
  "basic",
  "trigger",
  "accept",
  "limits",
  "single",
  "list",
  "prompt",
  "page",
  "folder",
  "camera",
  "disabled",
  "avatar",
  "controlled",
  "validate",
  "announcement",
  "controller",
  "form",
  "field",
]

// Drops a file on a zone the way a browser would, with a real DataTransfer.
async function dropFile(zone: Locator, name: string, type: string) {
  const data = await zone.page().evaluateHandle(
    ({ name, type }) => {
      const transfer = new DataTransfer()
      transfer.items.add(new File(["hello"], name, { type }))
      return transfer
    },
    { name, type },
  )
  for (const type of ["dragenter", "dragover", "drop"])
    await zone.evaluate(
      (el, { type, data }) =>
        el.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: data })),
      { type, data },
    )
}

for (const framework of frameworks) {
  test(`every file input example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/file-input`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders)
      expect(examplesIn(folder).sort(), folder).toEqual([...order, "render"].sort())
    // Every example has a button to choose files, or to drive it, except the
    // page-wide zone, which only takes drops.
    for (const [index, name] of order.entries())
      if (name !== "page") await expect(previews.nth(index).getByRole("button").first(), name).toBeAttached()

    // A drop on the basic zone lists the file, and its remove button takes it out.
    const basic = previews.nth(order.indexOf("basic"))
    await dropFile(basic.locator('[data-slot="file-input-dropzone"]'), "notes.txt", "text/plain")
    await expect(basic.getByRole("listitem")).toContainText("notes.txt")
    await basic.getByRole("button", { name: "Remove notes.txt" }).click()
    await expect(basic.getByRole("listitem")).toHaveCount(0)
    expect(errors).toEqual([])
  })
}
