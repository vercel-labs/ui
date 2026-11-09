import { expect, type Locator, type Page } from "@playwright/test"
import { test } from "./docs-test"
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

type Context = { popover: Locator; preview: Locator; page: Page }

type Example = {
  // The trigger to press.
  trigger: RegExp
  // What to check once the popover is open.
  check?: (context: Context) => Promise<void>
}

// The latest line in an example's console.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

// The examples in the order they appear on the Popover page.
const examples: Record<string, Example> = {
  basic: {
    trigger: /^Share$/,
    check: async ({ popover }) => {
      await expect(popover).toHaveAccessibleName("Share this document")
      await expect(popover.getByRole("textbox", { name: "Link" })).toBeFocused()
    },
  },
  form: { trigger: /^Edit Profile$/ },
  draft: { trigger: /^Add Note$/ },
  placement: { trigger: /^Delivery$/ },
  offsets: { trigger: /^Delivery$/ },
  arrow: { trigger: /^Help$/ },
  anchor: {
    trigger: /^Search filters$/,
    check: async ({ popover, preview }) => {
      const [field, box] = await Promise.all([
        preview.getByRole("searchbox", { name: "Search files" }).boundingBox(),
        popover.boundingBox(),
      ])
      expect(Math.abs(box!.x - field!.x)).toBeLessThanOrEqual(1)
    },
  },
  modal: { trigger: /^Add Comment$/ },
  focus: {
    trigger: /^Rename$/,
    check: async ({ popover }) => {
      await expect(popover.getByRole("textbox", { name: "Name" })).toBeFocused()
    },
  },
  hover: { trigger: /^@kofi$/ },
  controlled: { trigger: /^Set Status$/ },
  shortcut: { trigger: /^Invite/ },
  payload: {
    trigger: /^Edit Inès Moreau$/,
    check: async ({ popover, preview }) => {
      await expect(popover).toHaveAccessibleName("Inès Moreau")
      await expect(lastLog(preview)).toHaveText("Editing Inès Moreau")
    },
  },
  animation: {
    trigger: /^What's New$/,
    check: async ({ preview }) => {
      await expect(lastLog(preview)).toHaveText("Open")
    },
  },
  presentation: {
    trigger: /^Add Reminder$/,
    check: async ({ popover }) => {
      await expect(popover).toHaveAttribute("data-presentation", "sheet")
    },
  },
  "custom-rendering": {
    trigger: /^Show Updates/,
    check: async ({ preview }) => {
      await expect(
        preview.getByRole("button", { name: /^Hide Updates/ })
      ).toBeVisible()
    },
  },
}
const order = Object.keys(examples)

const open = async (page: Page, framework: string, name: string) => {
  await page.goto(`/docs/${framework}/components/popover`)
  await page.waitForLoadState("networkidle")
  const preview = page.locator(`[data-example="popover/${name}"]`)
  await preview.scrollIntoViewIfNeeded()
  return preview
}

for (const framework of frameworks) {
  test(`every popover example works in ${framework}`, async ({ page }) => {
    test.setTimeout(120_000)
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on(
      "console",
      (message) => message.type() === "error" && errors.push(message.text())
    )
    await page.goto(`/docs/${framework}/components/popover`)
    await page.waitForLoadState("networkidle")
    const previews = page.locator("[data-example]")
    await expect(previews).toHaveCount(order.length)
    for (const folder of folders) {
      expect(examplesIn(folder).sort(), folder).toEqual(
        [...order, "align", "rtl"].sort()
      )
    }

    for (const [index, name] of order.entries()) {
      await test.step(name, async () => {
        const preview = previews.nth(index)
        await expect(preview).toHaveAttribute("data-example", `popover/${name}`)
        const trigger = preview
          .getByRole("button", { name: examples[name].trigger })
          .first()
        await trigger.scrollIntoViewIfNeeded()
        await trigger.click()
        const popover = page.getByRole("dialog").first()
        await expect(popover, `${name} opens`).toBeVisible()
        await examples[name].check?.({ popover, preview, page })
        await page.keyboard.press("Escape")
        await expect(page.getByRole("dialog"), `${name} closes`).toHaveCount(0)
      })
    }

    expect(errors).toEqual([])
  })
}

// A form saves its value and closes the popover.
for (const framework of frameworks) {
  test(`the form saves and closes in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "form")
    await preview.getByRole("button", { name: "Edit Profile" }).click()
    const popover = page.getByRole("dialog", { name: "Edit profile" })
    await popover.getByRole("textbox", { name: "Name" }).fill("Wren Takahashi")
    await popover.getByRole("button", { name: "Save" }).click()
    await expect(popover).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Saved Wren Takahashi")
  })
}

// With a note typed, Escape asks first, and Discard closes.
for (const framework of frameworks) {
  test(`a note keeps the popover open in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "draft")
    await preview.getByRole("button", { name: "Add Note" }).click()
    const popover = page.getByRole("dialog", { name: "Add a note" })
    await popover
      .getByRole("textbox", { name: "Note" })
      .fill("Order more labels")
    await page.keyboard.press("Escape")
    await expect(popover).toBeVisible()
    await expect(popover.getByRole("alert")).toContainText("Discard your note?")
    await expect(lastLog(preview)).toHaveText("Kept open (escape-key)")
    await popover.getByRole("button", { name: "Discard" }).click()
    await expect(popover).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Discarded the note")
  })
}

// The popover opens on the side chosen for it.
for (const framework of frameworks) {
  test(`the popover opens on the chosen side in ${framework}`, async ({
    page,
  }) => {
    const preview = await open(page, framework, "placement")
    await preview.getByRole("combobox", { name: "Side" }).click()
    await page.getByRole("option", { name: "Top", exact: true }).click()
    const trigger = preview.getByRole("button", { name: "Delivery" })
    await trigger.click()
    const popover = page.getByRole("dialog", { name: "Delivery window" })
    await expect(popover).toHaveAttribute("data-side", "top")
    const [button, box] = await Promise.all([
      trigger.boundingBox(),
      popover.boundingBox(),
    ])
    expect(box!.y + box!.height).toBeLessThanOrEqual(button!.y)
  })
}

// The arrow example moves the open popover to another side. The arrow follows it.
for (const framework of frameworks) {
  test(`the arrow follows the popover's side in ${framework}`, async ({
    page,
  }) => {
    const preview = await open(page, framework, "arrow")
    await preview.getByRole("button", { name: "Help" }).click()
    const dialog = page.getByRole("dialog", { name: "Keyboard shortcuts" })
    const arrow = dialog.locator('[data-slot="popover-arrow"]')
    for (const side of ["Top", "Right", "Left", "Bottom"]) {
      await preview
        .getByRole("group", { name: "Side" })
        .getByRole("button", { name: side })
        .click()
      await expect(dialog).toBeVisible()
      await expect(dialog).toHaveAttribute("data-side", side.toLowerCase())
      await expect(arrow).toHaveAttribute("data-side", side.toLowerCase())
    }
    // Escape still closes it while focus is on a Side button.
    await expect(preview.getByRole("button", { name: "Bottom" })).toBeFocused()
    await page.keyboard.press("Escape")
    await expect(dialog).toHaveCount(0)
  })
}

// The arrow sticks out of the popover, so the popover mustn't clip it.
for (const framework of frameworks) {
  test(`the arrow shows outside the popover on every side in ${framework}`, async ({
    page,
  }) => {
    const preview = await open(page, framework, "arrow")
    await preview.getByRole("button", { name: "Help" }).click()
    const dialog = page.getByRole("dialog", { name: "Keyboard shortcuts" })
    const arrow = dialog.locator('[data-slot="popover-arrow"]')
    await expect
      .poll(() => dialog.evaluate((el) => getComputedStyle(el).overflow))
      .toBe("visible")
    for (const side of ["top", "right", "left", "bottom"]) {
      await preview
        .getByRole("group", { name: "Side" })
        .getByRole("button", { name: side })
        .click()
      await expect(arrow).toHaveAttribute("data-side", side)
      const nearTip = async () => {
        const box = (await arrow.boundingBox())!
        const x =
          { left: box.x + box.width - 3, right: box.x + 3 }[side] ??
          box.x + box.width / 2
        const y =
          { top: box.y + box.height - 3, bottom: box.y + 3 }[side] ??
          box.y + box.height / 2
        return arrow.evaluate(
          (el, point) => el === document.elementFromPoint(point.x, point.y),
          { x, y }
        )
      }
      await expect.poll(nearTip, `the arrow's tip on the ${side}`).toBe(true)
    }
  })
}

// Each popover in the focus example starts focus somewhere else.
for (const framework of frameworks) {
  test(`initialFocus picks where focus starts in ${framework}`, async ({
    page,
  }) => {
    const preview = await open(page, framework, "focus")
    await preview.getByRole("button", { name: "Publish" }).click()
    const publish = page.getByRole("dialog", { name: "Publish changes?" })
    await expect(publish.getByRole("button", { name: "Publish" })).toBeFocused()
    await page.keyboard.press("Escape")
    const status = preview.getByRole("button", { name: "Status" })
    await status.click()
    await expect(
      page.getByRole("dialog", { name: "All systems normal" })
    ).toBeVisible()
    await expect(status).toBeFocused()
  })
}

// Hovering opens the popover, and its content can be used.
for (const framework of frameworks) {
  test(`hovering opens the profile in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "hover")
    await preview.getByRole("button", { name: "@kofi" }).hover()
    const popover = page.getByRole("dialog", { name: "Kofi Mensah" })
    await expect(popover).toBeVisible()
    await popover.getByRole("button", { name: "Follow" }).click()
    await expect(lastLog(preview)).toHaveText("Followed @kofi")
  })
}

// The checkbox and the popover share one open state.
for (const framework of frameworks) {
  test(`the controlled popover follows its checkbox in ${framework}`, async ({
    page,
  }) => {
    const preview = await open(page, framework, "controlled")
    const checkbox = preview.getByRole("checkbox", { name: "Open" })
    await checkbox.click()
    const popover = page.getByRole("dialog", { name: "Set a status" })
    await expect(popover).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(popover).toHaveCount(0)
    await expect(checkbox).not.toBeChecked()
    await expect(lastLog(preview)).toHaveText("Closed (escape-key)")
    // Pressing the label while it's open closes it once, not as an outside press the click then undoes.
    const label = preview.locator("label", { hasText: "Open" })
    await label.click()
    await expect(popover).toBeVisible()
    await label.click()
    await expect(popover).toHaveCount(0)
    await expect(checkbox).not.toBeChecked()
    await page.waitForTimeout(300)
    await expect(popover).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText("Closed (escape-key)")
  })
}

// The shortcut example's trigger opens and closes with its keys, which it advertises.
for (const framework of frameworks) {
  test(`the shortcut example opens the popover in ${framework}`, async ({
    page,
  }) => {
    const preview = await open(page, framework, "shortcut")
    const trigger = preview.getByRole("button", { name: /^Invite/ })
    const popover = page.getByRole("dialog", { name: "Invite people" })
    await expect(trigger).toHaveAttribute(
      "aria-keyshortcuts",
      /^(Meta|Control)\+I$/
    )
    await page.keyboard.press("ControlOrMeta+i")
    await expect(popover).toBeVisible()
    await page.keyboard.press("ControlOrMeta+i")
    await expect(popover).toHaveCount(0)
  })
}

// One popover edits the row that opened it, and code can open it too.
for (const framework of frameworks) {
  test(`one popover edits each row in ${framework}`, async ({ page }) => {
    const preview = await open(page, framework, "payload")
    await expect(
      preview.getByRole("button", { name: "Edit Hollis Grant" })
    ).toBeDisabled()
    await preview.getByRole("button", { name: "Edit Kofi Mensah" }).click()
    const popover = page.getByRole("dialog", { name: "Kofi Mensah" })
    await popover.getByRole("combobox", { name: "Role" }).selectOption("Admin")
    await popover.getByRole("button", { name: "Save" }).click()
    await expect(popover).toHaveCount(0)
    await expect(
      preview.getByRole("listitem").filter({ hasText: "Kofi Mensah" })
    ).toContainText("Admin")

    await preview.getByRole("button", { name: "Edit Newest Member" }).click()
    const newest = page.getByRole("dialog", { name: "Wren Takahashi" })
    await newest.getByRole("button", { name: "Cancel" }).click()
    await expect(newest).toHaveCount(0)
    await expect(lastLog(preview)).toHaveText(
      "Closed (close-press), returned cancel"
    )
  })
}

// Every public option and content prop is shown in at least one example.
test("every popover prop appears in an example", () => {
  const source = readFileSync(
    path.join(
      import.meta.dirname,
      "../../packages/core/src/components/popover/popover.ts"
    ),
    "utf8"
  )
  // A type's own fields, after any types it extends, like `PortalProps & {`.
  const block = (name: string) =>
    source
      .slice(source.search(new RegExp(`type ${name} = [^{]*\\{`)))
      .split(/\n\s*\}\n/)[0]
  // A popover that starts open would cover the docs page as it loads.
  const props = [
    ...`${block("PopoverOptions")}${block("ContentProps")}`.matchAll(
      /^ +(\w+)\?:/gm
    ),
  ]
    .map((match) => match[1])
    .filter((prop) => prop !== "defaultOpen")
  expect(props.length).toBeGreaterThan(10)
  const kebab = (name: string) =>
    name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
  for (const folder of folders) {
    const code = readdirSync(path.join(root, folder), { withFileTypes: true })
      .filter((file) => file.isFile())
      .map((file) => readFileSync(path.join(root, folder, file.name), "utf8"))
      .join("\n")
    // Callbacks are events in Vue (@open-change) and web components (openchange).
    // A web component's controller is its `api` property.
    const spellings = (prop: string) => [
      prop,
      kebab(prop),
      kebab(prop.replace(/^on(\w)/, (_, char: string) => char.toLowerCase())),
      prop.replace(/^on/, "").toLowerCase(),
      ...(prop === "controller" ? [".api."] : []),
    ]
    const missing = props.filter(
      (prop) => !spellings(prop).some((spelling) => code.includes(spelling))
    )
    expect(missing, folder).toEqual([])
  }
})
