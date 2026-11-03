import { expect, test, type Locator } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"
import { onPage } from "./docs-helpers"

const frameworks = ["react", "vue", "svelte", "web-components", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/slider")
const folders = ["react", "vue", "svelte", "web", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Slider page, a thumb in each, its value,
// and its value after ArrowRight. Right to left, ArrowRight decreases it.
const thumbs: Record<string, { name: RegExp; from: string; to: string }> = {
  basic: { name: /^Volume$/, from: "75", to: "76" },
  range: { name: /^Minimum$/, from: "25", to: "30" },
  multiple: { name: /^Low$/, from: "10", to: "20" },
  vertical: { name: /^Bass$/, from: "50", to: "51" },
  field: { name: /^Volume$/, from: "0.3", to: "0.31" },
  disabled: { name: /^Disabled$/, from: "50", to: "50" },
  rtl: { name: /^الحد الأدنى$/, from: "20", to: "19" },
  controlled: { name: /^Minimum temperature$/, from: "0.3", to: "0.4" },
  step: { name: /^Year$/, from: "2010", to: "2015" },
  "large-step": { name: /^Zoom$/, from: "100", to: "101" },
  "min-steps": { name: /^Opens$/, from: "540", to: "555" },
  format: { name: /^Budget$/, from: "40", to: "41" },
  commit: { name: /^Brightness$/, from: "50", to: "51" },
  controller: { name: /^Volume$/, from: "40", to: "41" },
  render: { name: /^Brightness$/, from: "60", to: "61" },
  form: { name: /^Minimum price$/, from: "200", to: "210" },
}
const fixtures = Object.keys(thumbs)
const order = fixtures.filter(onPage)

// A thumb's value: the range input's, or aria-valuenow on any other element.
const valueOf = (thumb: Locator) =>
  thumb.evaluate((el) => (el instanceof HTMLInputElement ? el.value : el.getAttribute("aria-valuenow")))

for (const framework of frameworks) {
  test(`every slider example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/slider`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtures].sort())

    for (const [index, name] of order.entries()) {
      const { name: label, from, to } = thumbs[name]
      const thumb = previews.nth(index).getByRole("slider", { name: label })
      await expect.poll(() => valueOf(thumb), `${name} starts`).toBe(from)
      await thumb.focus()
      await page.keyboard.press("ArrowRight")
      await expect.poll(() => valueOf(thumb), `${name} after ArrowRight`).toBe(to)
    }

    // The controller moves the slider from outside.
    const controller = previews.nth(order.indexOf("controller"))
    await controller.getByRole("button", { name: "Mute" }).click()
    await expect.poll(() => valueOf(controller.getByRole("slider"))).toBe("0")

    // Committing saves once, after the key comes up.
    const commit = previews.nth(order.indexOf("commit"))
    await expect(commit.getByText(/^Saved 51 \(step-key\)/)).toBeVisible()

    // Saving submits a range as "start/end", with the slider outside the form, and Reset restores it.
    const form = previews.nth(order.indexOf("form"))
    await form.getByRole("button", { name: "Save" }).click()
    await expect(form.getByText("Submitted: price=210/800, rating=3, distance=25")).toBeVisible()
    await form.getByRole("button", { name: "Reset" }).click()
    await expect.poll(() => valueOf(form.getByRole("slider", { name: /^Minimum price$/ }))).toBe("200")

    expect(errors).toEqual([])
  })
}
