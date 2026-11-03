import { expect, test } from "@playwright/test"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const frameworks = ["react", "vue", "web-components", "svelte", "solid"]
// Every framework folder must have the same examples.
const root = path.join(import.meta.dirname, "../../examples/components/popover")
const folders = ["react", "vue", "web", "svelte", "solid"]
const examplesIn = (folder: string) =>
  readdirSync(path.join(root, folder), { withFileTypes: true })
    .filter((file) => file.isFile())
    .map((file) => file.name.replace(/\.\w+$/, ""))

// The order examples appear on the Popover page, and the trigger to press in each.
const triggers: Record<string, RegExp> = {
  basic: /^Open popover$/,
  form: /^Edit profile$/,
  draft: /^Add note$/,
  placement: /^Placement$/,
  arrow: /^Help$/,
  anchor: /filters/i,
  modal: /^(Non-modal|Modal)$/,
  focus: /^(First field|Status)$/,
  hover: /^@ada$/,
  controlled: /^Share$/,
  shortcut: /^Dimensions$/,
  payload: /^Edit Grace Hopper$/,
  container: /^Open (in the box|popover)$/,
  animation: /^Animated$/,
  presentation: /^Dimensions$/,
}
const order = Object.keys(triggers)

for (const framework of frameworks) {
  test(`every popover example works in ${framework}`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    await page.goto(`/docs/${framework}/components/popover`)
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders)
      expect(examplesIn(folder).sort(), folder).toEqual(
        [...order, "align", "offsets", "rtl", "custom-rendering"].sort(),
      )

    for (const [index, name] of order.entries()) {
      const trigger = previews.nth(index).getByRole("button", { name: triggers[name] }).first()
      await trigger.scrollIntoViewIfNeeded()
      await trigger.click()
      await expect(page.getByRole("dialog").first(), `${name} popover`).toBeVisible()
      await page.keyboard.press("Escape")
      await expect(page.getByRole("dialog"), `${name} closes`).toHaveCount(0)
    }

    expect(errors).toEqual([])
  })
}

// The arrow example moves the open popover to another side. The arrow follows it.
for (const framework of frameworks) {
  test(`the arrow follows the popover's side in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/popover`)
    const preview = page.locator("[data-example]").nth(order.indexOf("arrow"))
    const trigger = preview.getByRole("button", { name: "Help" })
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    const dialog = page.getByRole("dialog", { name: "Keyboard shortcuts" })
    const arrow = dialog.locator('[data-slot="popover-arrow"]')
    for (const side of ["top", "right", "left", "bottom"]) {
      await preview.getByRole("group", { name: /side/i }).getByRole("button", { name: side }).click()
      await expect(dialog).toBeVisible()
      await expect(dialog).toHaveAttribute("data-side", side)
      await expect(arrow).toHaveAttribute("data-side", side)
    }
  })
}

// The arrow sticks out of the popover, so the popover mustn't clip it.
for (const framework of frameworks) {
  test(`the arrow shows outside the popover on every side in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/popover`)
    const preview = page.locator("[data-example]").nth(order.indexOf("arrow"))
    const trigger = preview.getByRole("button", { name: "Help" })
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    const dialog = page.getByRole("dialog", { name: "Keyboard shortcuts" })
    const arrow = dialog.locator('[data-slot="popover-arrow"]')
    await expect.poll(() => dialog.evaluate((el) => getComputedStyle(el).overflow)).toBe("visible")
    for (const side of ["top", "right", "left", "bottom"]) {
      await preview.getByRole("group", { name: /side/i }).getByRole("button", { name: side }).click()
      await expect(arrow).toHaveAttribute("data-side", side)
      const nearTip = async () => {
        const box = (await arrow.boundingBox())!
        const x = { left: box.x + box.width - 3, right: box.x + 3 }[side] ?? box.x + box.width / 2
        const y = { top: box.y + box.height - 3, bottom: box.y + 3 }[side] ?? box.y + box.height / 2
        return arrow.evaluate((el, point) => el === document.elementFromPoint(point.x, point.y), { x, y })
      }
      await expect.poll(nearTip, `the arrow's tip on the ${side}`).toBe(true)
    }
  })
}

// The shortcut example's trigger opens and closes with its keys, which it advertises.
for (const framework of frameworks) {
  test(`the shortcut example opens the popover in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/popover`)
    const preview = page.locator("[data-example]").nth(order.indexOf("shortcut"))
    // Examples load after the page, so wait for the trigger before pressing keys.
    const trigger = preview.getByRole("button", { name: triggers.shortcut })
    await trigger.scrollIntoViewIfNeeded()
    const popover = page.getByRole("dialog", { name: "Dimensions" })
    await expect(trigger).toHaveAttribute("aria-keyshortcuts", /^(Meta|Control)\+I$/)
    await page.keyboard.press("ControlOrMeta+i")
    await expect(popover).toBeVisible()
    await page.keyboard.press("ControlOrMeta+i")
    await expect(popover).toHaveCount(0)
  })
}

// Every public option and content prop is shown in at least one example.
test("every popover prop appears in an example", () => {
  const source = readFileSync(
    path.join(import.meta.dirname, "../../packages/core/src/components/popover/popover.ts"),
    "utf8",
  )
  // A type's own fields, after any types it extends, like `PortalProps & {`.
  const block = (name: string) =>
    source.slice(source.search(new RegExp(`type ${name} = [^{]*\\{`))).split(/\n\s*\}\n/)[0]
  const props = [...`${block("PopoverOptions")}${block("ContentProps")}`.matchAll(/^ +(\w+)\?:/gm)].map(
    (match) => match[1],
  )
  expect(props.length).toBeGreaterThan(10)
  const kebab = (name: string) => name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
  for (const folder of folders) {
    const code = readdirSync(path.join(root, folder), { withFileTypes: true })
      .filter((file) => file.isFile())
      .map((file) => readFileSync(path.join(root, folder, file.name), "utf8"))
      .join("\n")
    // Callbacks are events in Vue (@open-change) and web components (openchange).
    const spellings = (prop: string) => [
      prop,
      kebab(prop),
      kebab(prop.replace(/^on(\w)/, (_, char: string) => char.toLowerCase())),
      prop.replace(/^on/, "").toLowerCase(),
    ]
    const missing = props.filter((prop) => !spellings(prop).some((spelling) => code.includes(spelling)))
    expect(missing, folder).toEqual([])
  }
})

// The popover is named by its title.
for (const framework of frameworks) {
  test(`the popover is named by its title in ${framework}`, async ({ page }) => {
    await page.goto(`/docs/${framework}/components/popover`)
    await page.waitForLoadState("networkidle")
    await page
      .locator("[data-example]")
      .first()
      .getByRole("button", { name: /^Open popover$/ })
      .click()
    await expect(page.getByRole("dialog", { name: "Dimensions" })).toBeVisible()
  })
}
