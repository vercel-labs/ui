import { expect, type Locator } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(import.meta.dirname, "../../examples/components/file-input", folder), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// Drags a file over a target the way a browser would, with a real DataTransfer,
// and drops it unless told to stop while it's over the target.
async function dragFile(
  target: Locator,
  name: string,
  type: string,
  events = ["dragenter", "dragover", "drop"],
) {
  const data = await target.page().evaluateHandle(
    ({ name, type }) => {
      const transfer = new DataTransfer()
      transfer.items.add(new File(["hello"], name, { type }))
      return transfer
    },
    { name, type },
  )
  for (const type of events)
    await target.evaluate(
      (el, { type, data }) =>
        el.dispatchEvent(new DragEvent(type, { bubbles: true, cancelable: true, dataTransfer: data })),
      { type, data },
    )
}

// The examples in the order they appear on the File Input page.
const examples: Record<string, (preview: Locator) => Promise<void>> = {
  // A drop on the zone lists the file, and its remove button takes it out.
  basic: async (preview) => {
    await expect(preview.getByRole("button", { name: "Browse Files" })).toBeVisible()
    await dragFile(preview.locator('[data-slot="file-input-dropzone"]'), "notes.txt", "text/plain")
    await expect(preview.getByRole("listitem")).toContainText("notes.txt")
    await preview.getByRole("button", { name: "Remove notes.txt" }).click()
    await expect(preview.getByRole("listitem")).toHaveCount(0)
  },
  // A file over the page shows the overlay, and a drop outside every zone joins the list.
  page: async (preview) => {
    await expect(preview.getByRole("button", { name: "Upload Files" })).toBeVisible()
    const overlay = preview.locator('[data-slot="file-input-dropzone"]')
    const body = preview.page().locator("body")
    await dragFile(body, "brief.pdf", "application/pdf", ["dragenter", "dragover"])
    await expect(overlay).toHaveAttribute("data-dragging", "")
    await expect(overlay).toBeVisible()
    await dragFile(body, "brief.pdf", "application/pdf", ["drop"])
    await expect(overlay).not.toHaveAttribute("data-dragging")
    await expect(preview.getByRole("listitem")).toContainText("brief.pdf")
    await preview.getByRole("button", { name: "Remove brief.pdf" }).click()
    await expect(preview.getByRole("listitem")).toHaveCount(0)
  },
}
const order = Object.keys(examples)

for (const framework of frameworks) {
  test(`every file input example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/file-input`)
    await page.waitForLoadState("networkidle")
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order].sort())

    for (const [index, name] of order.entries())
      await test.step(name, async () => {
        const preview = previews.nth(index)
        await preview.scrollIntoViewIfNeeded()
        await examples[name](preview)
      })

    expect(errors).toEqual([])
  })
}
