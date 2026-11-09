import AxeBuilder from "@axe-core/playwright"
import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

const save = (page: Page) =>
  page.getByRole("button", { name: "Save", exact: true })

// Development warnings the page printed, as they were printed.
function warnings(page: Page) {
  const printed: string[] = []
  page.on(
    "console",
    (message) => message.type() === "warning" && printed.push(message.text())
  )
  return printed
}

async function audit(page: Page) {
  // Page structure rules are about the fixture page, not the component.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations while closed", async ({ page, open }) => {
  await open("tooltip")
  expect(await audit(page)).toEqual([])
})

test("no axe violations while open", async ({ page, open }) => {
  await open("tooltip")
  await save(page).hover()
  await expect(page.getByText("Save your changes")).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test(
  "an open tooltip is a tooltip that describes its trigger",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("tooltip")
    await save(page).hover()
    await expect(page.getByRole("tooltip")).toHaveText(/Save your changes/)
    await expect(save(page)).toHaveAccessibleDescription("Save your changes")
  }
)

test(
  "the trigger is described before the tooltip opens, so a screen reader hears it on focus",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("tooltip")
    // Hidden content counts in full, but the shortcut's keys stay out, since aria-keyshortcuts announces them.
    await expect(save(page)).toHaveAccessibleDescription("Save your changes")
  }
)

test("an icon button without a name of its own is named by its tooltip", async ({
  page,
  open,
}) => {
  await open("tooltip")
  for (const name of ["Bold", "Italic", "Underline"]) {
    await expect(page.getByRole("button", { name, exact: true })).toBeVisible()
  }
  await expect(
    page.getByRole("button", { name: "Bold" })
  ).not.toHaveAccessibleDescription("Bold")
})

test(
  "a trigger with a name of its own is described, not renamed",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("tooltip")
    const info = page.getByRole("button", { name: "About billing" })
    await expect(info).toHaveAccessibleDescription(
      "Billing runs on the first of the month."
    )
  }
)

test(
  "type label makes the tooltip name its trigger",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("tooltip", { type: "label" })
    await expect(
      page.getByRole("button", { name: /^Save your changes/ })
    ).toBeVisible()
  }
)

test(
  "a tooltip that names its trigger leaves its shortcut's keys out of the name, open or closed",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("tooltip", { type: "label" })
    const trigger = page.getByRole("button", {
      name: "Save your changes",
      exact: true,
    })
    await expect(trigger).toBeVisible()
    await trigger.hover()
    await expect(page.getByRole("tooltip")).toContainText(/⌘S|Ctrl\+S/)
    await expect(trigger).toBeVisible()
  }
)

test(
  "an icon button its tooltip names, shared with a popover, doesn't warn about a missing name",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    const printed = warnings(page)
    await open("tooltip", { "icon-popover": "" })
    await expect(
      page.getByRole("button", { name: "Notifications", exact: true })
    ).toBeVisible()
    // The icon popover trigger with no tooltip has no name, and still warns.
    const missing = () =>
      new Set(
        printed.filter((text) =>
          text.includes("The trigger has no accessible name")
        )
      )
    await expect.poll(() => missing().size).toBe(1)
    await page.evaluate(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    expect(missing().size).toBe(1)
  }
)

test(
  "the trigger announces the shortcut its tooltip shows",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("tooltip")
    const mac = await page.evaluate(() =>
      /Mac|iPhone|iPad/.test(navigator.platform)
    )
    await expect(save(page)).toHaveAttribute(
      "aria-keyshortcuts",
      mac ? "Meta+S" : "Control+S"
    )
    await save(page).hover()
    await expect(page.getByRole("tooltip")).toContainText(mac ? "⌘S" : "Ctrl+S")
    // The shortcut is shown, but the description stays the text alone.
    await expect(save(page)).toHaveAccessibleDescription("Save your changes")
  }
)

// Every implementation must expose the same accessibility tree.
test("accessibility tree", { tag: "@enhancement" }, async ({ page, open }) => {
  await open("tooltip")
  await save(page).hover()
  await expect(page.getByRole("tooltip")).toMatchAriaSnapshot(`
    - tooltip "Save your changes"
  `)
})
