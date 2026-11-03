import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/collapsible")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Collapsible page, a closed trigger to open
// in each, and text its panel shows once open.
const next: Record<string, { trigger: RegExp; text: string | RegExp }> = {
  basic: { trigger: /^Order details/, text: "2 × Linen shirt" },
  "settings-panel": { trigger: /^Edit each axis/, text: "Radius X" },
  "file-tree": { trigger: /^hooks$/, text: "use-mobile.ts" },
  disabled: { trigger: /^Shipping details/, text: "Arrives in 3 to 5 business days." },
  "find-in-page": { trigger: /^Ingredients/, text: "a pinch of cardamom" },
  "keep-mounted": { trigger: /^Add a delivery note/, text: /^\s*Delivery note\s*$/ },
  animation: { trigger: /^Release notes/, text: "Uploads resume after the connection drops." },
  controlled: { trigger: /^Recovery codes/, text: "7KQ2-M9XD" },
  render: { trigger: /Track parcel/, text: "Out for delivery" },
}
const order = Object.keys(next)

for (const framework of frameworks) {
  test(`every collapsible example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/collapsible`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...order, "rtl"].sort())

    for (const [index, name] of order.entries()) {
      const preview = previews.nth(index)
      const trigger = preview.getByRole("button", { name: next[name].trigger })
      const text = preview.getByText(next[name].text, { exact: false }).first()
      await expect(trigger, `${name} trigger`).toHaveAttribute("aria-expanded", "false")
      await expect(text, `${name} starts hidden`).toBeHidden()
      await trigger.click()
      await expect(trigger, `${name} opens`).toHaveAttribute("aria-expanded", "true")
      await expect(text, `${name} panel`).toBeVisible()
    }

    const preview = (name: string) => previews.nth(order.indexOf(name))
    const focused = (locator: ReturnType<typeof preview>) =>
      expect.poll(() => locator.evaluate((el) => el === document.activeElement))

    // Enter and Space toggle the panel, and focus stays on the trigger.
    const order4189 = preview("basic").getByRole("button", { name: next.basic.trigger })
    await order4189.focus()
    await page.keyboard.press("Enter")
    await expect(order4189).toHaveAttribute("aria-expanded", "false")
    await page.keyboard.press(" ")
    await expect(order4189).toHaveAttribute("aria-expanded", "true")
    await focused(order4189).toBe(true)

    // Tab moves from the open trigger into the panel's fields.
    await preview("settings-panel").getByRole("button", { name: next["settings-panel"].trigger }).focus()
    await page.keyboard.press("Tab")
    await focused(preview("settings-panel").getByRole("spinbutton", { name: "Radius X" })).toBe(true)

    // Folders nest: components starts open, and opening a folder inside it keeps it open.
    const tree = preview("file-tree")
    await tree.getByRole("button", { name: /^ui$/ }).click()
    await expect(tree.getByText("dialog.tsx")).toBeVisible()
    await expect(tree.getByRole("button", { name: /^components$/ })).toHaveAttribute("aria-expanded", "true")

    // A disabled collapsible stays in the tab order, says it's disabled, and never opens.
    const disabled = preview("disabled").getByRole("button", { name: /^Gift options/ })
    await preview("disabled").getByRole("button", { name: next.disabled.trigger }).focus()
    await page.keyboard.press("Tab")
    await focused(disabled).toBe(true)
    await page.keyboard.press("Enter")
    await expect(disabled).toHaveAttribute("aria-disabled", "true")
    await disabled.click({ force: true })
    await expect(disabled).toHaveAttribute("aria-expanded", "false")
    await expect(preview("disabled").getByText("Add a gift message")).toBeHidden()

    // Find in page reveals the closed panel's text at once, without an animation.
    const ingredients = preview("find-in-page").getByRole("button", { name: next["find-in-page"].trigger })
    await ingredients.click()
    await expect(preview("find-in-page").locator("[hidden=until-found]")).toHaveCount(1)
    await preview("find-in-page")
      .locator("[hidden=until-found]")
      .evaluate((panel) => panel.dispatchEvent(new Event("beforematch", { bubbles: true })))
    await expect(ingredients).toHaveAttribute("aria-expanded", "true")
    await expect(preview("find-in-page").getByText("a pinch of cardamom")).toBeVisible()

    // A kept-mounted panel keeps what was typed in it, and closing it from inside focuses the trigger.
    const kept = preview("keep-mounted")
    const note = kept.getByRole("button", { name: /^Add a delivery note/ })
    await kept.getByRole("textbox", { name: "Delivery note" }).fill("Leave it by the door")
    await kept.getByRole("textbox", { name: "Delivery note" }).focus()
    await note.click()
    await expect(note).toHaveAttribute("aria-expanded", "false")
    await expect(kept.getByRole("textbox", { name: "Delivery note" })).toBeHidden()
    await focused(note).toBe(true)
    await note.click()
    await expect(kept.getByRole("textbox", { name: "Delivery note" })).toHaveValue("Leave it by the door")

    // The completion callback reports after the animation, opening and closing.
    const notes = preview("animation").getByRole("button", { name: next.animation.trigger })
    await expect(preview("animation").getByText("Finished opening")).toBeVisible()
    await notes.click()
    await expect(preview("animation").getByText("Finished closing")).toBeVisible()

    // The controller outside the collapsible toggles it, with its own reason. A press has another.
    const controlled = preview("controlled")
    const codes = controlled.getByRole("button", { name: next.controlled.trigger })
    await controlled.getByRole("button", { name: "Toggle from outside" }).click()
    await expect(codes).toHaveAttribute("aria-expanded", "false")
    await expect(controlled.getByText("Closed, last change: imperative")).toBeVisible()
    await codes.click()
    await expect(controlled.getByText("Open, last change: trigger-press")).toBeVisible()
    // Done closes it through the controller, and focus moves from Done to the trigger.
    await controlled.getByRole("button", { name: "Done" }).focus()
    await page.keyboard.press("Enter")
    await expect(controlled.getByText("Closed, last change: imperative")).toBeVisible()
    await focused(codes).toBe(true)

    // The render function's state picks the summary, beside a trigger inside a heading.
    const parcel = preview("render")
    await expect(parcel.getByText("3 updates")).toBeVisible()
    await expect(parcel.getByText("Arrives Thursday")).toBeHidden()
    await expect(parcel.getByRole("heading", { level: 3 }).getByRole("button")).toHaveCount(1)
    await expect(parcel.getByRole("list").getByRole("listitem")).toHaveCount(3)

    expect(errors).toEqual([])
  })
}
