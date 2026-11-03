import { expect, test } from "@playwright/test"
import { readdirSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "svelte", "solid", "web-components"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/accordion")
const folders = ["react", "vue", "svelte", "solid", "web"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The order examples appear on the Accordion page, and a closed item to open in each.
const next: Record<string, RegExp> = {
  basic: /^What is your return policy\?/,
  multiple: /^Privacy and security/,
  disabled: /^How do I update my email address\?/,
  rtl: /^ما هي سياسة الإرجاع؟/,
  collapsible: /^Timeline/,
  "find-in-page": /^Is it organic\?/,
  "keep-mounted": /^Formatting/,
  animation: /^Where does the height come from\?/,
  controlled: /^Sessions/,
  render: /^Import the parts/,
  "expand-all": /^Week 3: Control flow/,
  "deep-link": /^Exchanges/,
  nested: /^Billing/,
  search: /^Do you ship internationally\?/,
}
const fixtureNames = Object.keys(next)
const order = [
  "basic",
  "multiple",
  "disabled",
  "collapsible",
  "keep-mounted",
  "find-in-page",
  "deep-link",
  "animation",
  "controlled",
  "expand-all",
  "nested",
  "search",
  "rtl",
  "render",
]

for (const framework of frameworks) {
  test(`every accordion example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/accordion`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) expect(examplesIn(folder).sort(), folder).toEqual([...fixtureNames].sort())

    for (const name of order) {
      const preview = page.locator(`[data-example="accordion/${name}"]`)
      const trigger = preview.getByRole("button", { name: next[name] })
      await expect(trigger, `${name} trigger`).toHaveAttribute("aria-expanded", "false")
      await trigger.click()
      await expect(trigger, `${name} opens`).toHaveAttribute("aria-expanded", "true")
      await expect(preview.getByRole("region", { name: next[name] }), `${name} panel`).toBeVisible()
    }

    const preview = (name: string) => page.locator(`[data-example="accordion/${name}"]`)

    await expect(
      preview("basic").getByRole("button", { name: /^What are your shipping options/ }),
      "with one item open at a time, opening one closed the other",
    ).toHaveAttribute("aria-expanded", "false")
    await expect(
      preview("multiple").getByRole("button", { name: /^Notification settings/ }),
      "with multiple, both stay open",
    ).toHaveAttribute("aria-expanded", "true")

    await expect(
      preview("collapsible").getByRole("button", { name: /^Timeline/ }),
      "the open trigger that can't close says so",
    ).toHaveAttribute("aria-disabled", "true")
    await expect(
      preview("collapsible").getByRole("button", { name: /^Overview/ }),
      "the trigger that closed isn't marked as unable to close",
    ).not.toHaveAttribute("aria-disabled")

    // Find in page reveals a closed panel's text and opens its item.
    const fruit = preview("find-in-page").getByRole("button", { name: /^Which fruit do you stock/ })
    await preview("find-in-page")
      .locator("[hidden=until-found]")
      .filter({ hasText: "pineapple" })
      .evaluate((panel) => panel.dispatchEvent(new Event("beforematch", { bubbles: true })))
    await expect(fruit).toHaveAttribute("aria-expanded", "true")

    // An item's completion callback reports after the panel finishes animating. Opening an item
    // above closed another at the same time, so close and reopen it to see one report at a time.
    const height = preview("animation").getByRole("button", { name: next.animation })
    await height.click()
    await expect(
      preview("animation").getByText("Finished closing “Where does the height come from?”"),
    ).toBeVisible()
    await height.click()
    await expect(
      preview("animation").getByText("Finished opening “Where does the height come from?”"),
    ).toBeVisible()

    // Review security goes through the controller, so it reports its reason. Security asks
    // before it closes, in every framework.
    const settings = preview("controlled")
    await settings.getByRole("button", { name: "Review security" }).click()
    await expect(settings.getByText(/Open: .*security.*, last change: imperative/)).toBeVisible()
    const security = settings.getByRole("button", { name: /^Security/ })
    const answers: string[] = []
    page.once("dialog", (dialog) => (answers.push(dialog.message()), dialog.dismiss()))
    await security.click()
    await expect.poll(() => answers).toEqual(["Close the security settings?"])
    await expect(security).toHaveAttribute("aria-expanded", "true")
    page.once("dialog", (dialog) => dialog.accept())
    await security.click()
    await expect(security).toHaveAttribute("aria-expanded", "false")

    // A disabled item stays in the tab order.
    const access = preview("disabled").getByRole("button", { name: /^Can I access my account history/ })
    await access.focus()
    await page.keyboard.press("Tab")
    await expect(preview("disabled").getByRole("button", { name: /^Premium/ })).toBeFocused()

    // A disabled item never opens.
    const disabled = preview("disabled").getByRole("button", { name: /^Premium/ })
    await disabled.click({ force: true })
    await expect(disabled).toHaveAttribute("aria-expanded", "false")

    // Without collapsible, the open item stays open.
    const timeline = preview("collapsible").getByRole("button", { name: /^Timeline/ })
    await timeline.click({ force: true })
    await expect(timeline).toHaveAttribute("aria-expanded", "true")

    // A kept-mounted panel keeps what was typed in it.
    const kept = preview("keep-mounted")
    await kept.getByRole("button", { name: /^Reply/ }).click()
    await kept.getByRole("textbox", { name: "Your reply" }).fill("Looks good")
    await kept.getByRole("button", { name: /^Reply/ }).click()
    await kept.getByRole("button", { name: /^Reply/ }).click()
    await expect(kept.getByRole("textbox", { name: "Your reply" })).toHaveValue("Looks good")

    // A controller opens and closes every item.
    const syllabus = preview("expand-all")
    const weeks = syllabus.getByRole("button", { name: /^Week/ })
    await syllabus.getByRole("button", { name: "Expand all" }).click()
    for (const week of await weeks.all()) await expect(week).toHaveAttribute("aria-expanded", "true")
    await syllabus.getByRole("button", { name: "Collapse all" }).click()
    for (const week of await weeks.all()) await expect(week).toHaveAttribute("aria-expanded", "false")

    // A link to an element inside a closed panel opens its item.
    const deepLink = preview("deep-link")
    await deepLink.getByRole("link", { name: "Jump to the refund timeline" }).click()
    await expect(deepLink.getByRole("button", { name: /^Refunds/ })).toHaveAttribute("aria-expanded", "true")
    await expect(deepLink.getByText(/Timeline:/)).toBeVisible()

    // An inner accordion opens without closing the item around it.
    const nested = preview("nested")
    await nested.getByRole("button", { name: /^Invoices/ }).click()
    await expect(nested.getByRole("button", { name: /^Invoices/ })).toHaveAttribute("aria-expanded", "true")
    await expect(nested.getByRole("button", { name: /^Billing/ })).toHaveAttribute("aria-expanded", "true")

    // Searching filters the questions and opens every match.
    const faq = preview("search")
    const search = faq.getByLabel("Search questions")
    await search.fill("refund")
    await expect(faq.getByRole("button", { name: /^How long do refunds take\?/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
    await expect(faq.getByRole("button", { name: /^What is your return policy\?/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    )
    await expect(faq.getByRole("button", { name: /^Do you ship internationally\?/ })).toHaveCount(0)
    await search.fill("zzz")
    await expect(faq.getByText("No questions match “zzz”.")).toBeVisible()
    await search.fill("")
    await expect(faq.getByRole("button", { name: /\?$/ })).toHaveCount(6)
    for (const question of await faq.getByRole("button", { name: /\?$/ }).all())
      await expect(question).toHaveAttribute("aria-expanded", "false")
    // The status stays in the accessibility tree while empty, so its next message is announced.
    await expect(faq.getByRole("status")).not.toHaveCSS("display", "none")

    expect(errors).toEqual([])
  })
}

// Every trigger sits in a heading, so screen readers can move between items
// by heading.
for (const framework of frameworks) {
  test(`each item's header is a heading in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/accordion`)
    const preview = page.locator("[data-example]").first()
    const triggers = preview.locator("[aria-expanded]")
    await expect(triggers.first()).toBeVisible()
    await expect(preview.getByRole("heading", { level: 3 })).toHaveCount(await triggers.count())
  })
}
