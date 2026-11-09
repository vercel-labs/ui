import { expect, type Locator } from "@playwright/test"
import { test } from "./docs-test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(
  import.meta.dirname,
  "../../examples/components/collapsible"
)
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name.replace(/\.\w+$/, ""))

// The order examples appear on the Collapsible page, a closed trigger to open
// in each, and text its panel shows once open.
const next: Record<string, { trigger: RegExp; text: string | RegExp }> = {
  basic: { trigger: /^Order #4189/, text: "Canvas tote" },
  "keep-mounted": {
    trigger: /^Add a delivery note/,
    text: /^\s*Delivery note\s*$/,
  },
  "find-in-page": { trigger: /^Ingredients/, text: "a pinch of cardamom" },
  controlled: { trigger: /^Recovery codes/, text: "7KQ2-M9XD" },
  animation: {
    trigger: /^Release notes/,
    text: "Uploads resume after the connection drops.",
  },
  render: { trigger: /Track parcel/, text: "Out for delivery" },
}
const order = Object.keys(next)

// The last line an example logged to its console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

for (const framework of frameworks) {
  test(`every collapsible example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on(
      "console",
      (message) => message.type() === "error" && errors.push(message.text())
    )
    await page.goto(`/docs/${framework}/components/collapsible`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) {
      expect(examplesIn(folder).sort(), folder).toEqual(
        [...order, "rtl"].sort()
      )
    }

    for (const [index, name] of order.entries()) {
      const preview = previews.nth(index)
      const trigger = preview.getByRole("button", { name: next[name].trigger })
      const text = preview.getByText(next[name].text, { exact: false }).first()
      await expect(trigger, `${name} trigger`).toHaveAttribute(
        "aria-expanded",
        "false"
      )
      await expect(text, `${name} starts hidden`).toBeHidden()
      await trigger.click()
      await expect(trigger, `${name} opens`).toHaveAttribute(
        "aria-expanded",
        "true"
      )
      await expect(text, `${name} panel`).toBeVisible()
    }

    const preview = (name: string) => previews.nth(order.indexOf(name))
    const focused = (locator: ReturnType<typeof preview>) =>
      expect.poll(() => locator.evaluate((el) => el === document.activeElement))

    // Enter and Space toggle the panel, and focus stays on the trigger.
    const trigger = preview("basic").getByRole("button", {
      name: next.basic.trigger,
    })
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await page.keyboard.press(" ")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await focused(trigger).toBe(true)

    // Find in page reveals the closed panel's text at once, without an animation.
    const ingredients = preview("find-in-page").getByRole("button", {
      name: next["find-in-page"].trigger,
    })
    await ingredients.click()
    await expect(
      preview("find-in-page").locator("[hidden=until-found]")
    ).toHaveCount(1)
    await preview("find-in-page")
      .locator("[hidden=until-found]")
      .evaluate((panel) =>
        panel.dispatchEvent(new Event("beforematch", { bubbles: true }))
      )
    await expect(ingredients).toHaveAttribute("aria-expanded", "true")
    await expect(
      preview("find-in-page").getByText("a pinch of cardamom")
    ).toBeVisible()

    // A kept-mounted panel keeps what was typed in it, and closing it from inside focuses the trigger.
    const kept = preview("keep-mounted")
    const note = kept.getByRole("button", { name: /^Add a delivery note/ })
    await kept
      .getByRole("textbox", { name: "Delivery note" })
      .fill("Leave it by the door")
    await kept.getByRole("textbox", { name: "Delivery note" }).focus()
    await note.click()
    await expect(note).toHaveAttribute("aria-expanded", "false")
    await expect(
      kept.getByRole("textbox", { name: "Delivery note" })
    ).toBeHidden()
    await focused(note).toBe(true)
    await note.click()
    await expect(
      kept.getByRole("textbox", { name: "Delivery note" })
    ).toHaveValue("Leave it by the door")

    // The completion callback reports after the animation, opening and closing.
    const notes = preview("animation").getByRole("button", {
      name: next.animation.trigger,
    })
    await expect(lastLog(preview("animation"))).toHaveText("Finished opening")
    await notes.click()
    await expect(lastLog(preview("animation"))).toHaveText("Finished closing")

    // The controller outside the collapsible toggles it, with its own reason. A press has another.
    const controlled = preview("controlled")
    const codes = controlled.getByRole("button", {
      name: next.controlled.trigger,
    })
    await controlled.getByRole("button", { name: "Toggle" }).click()
    await expect(codes).toHaveAttribute("aria-expanded", "false")
    await expect(lastLog(controlled)).toHaveText("Closed (imperative)")
    await codes.click()
    await expect(lastLog(controlled)).toHaveText("Opened (trigger-press)")
    // Done closes it through the controller, and focus moves from Done to the trigger.
    await controlled.getByRole("button", { name: "Done" }).focus()
    await page.keyboard.press("Enter")
    await expect(lastLog(controlled)).toHaveText("Closed (imperative)")
    await focused(codes).toBe(true)

    // The render function's state picks the summary, beside a trigger inside a heading.
    const parcel = preview("render")
    await expect(parcel.getByText("3 updates")).toBeVisible()
    await expect(parcel.getByText("Arrives Thursday")).toBeHidden()
    await expect(
      parcel.getByRole("heading", { level: 3 }).getByRole("button")
    ).toHaveCount(1)
    await expect(parcel.getByRole("list").getByRole("listitem")).toHaveCount(3)

    expect(errors).toEqual([])
  })
}
