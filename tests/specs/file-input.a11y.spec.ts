import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"
import { fileInputFixture as f } from "../fixtures/file-input"
import {
  browse,
  drop,
  fire,
  list,
  png,
  transfer,
  txt,
  zone,
} from "./file-input.helpers"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

// The shared live region every component announces through.
const announcer = (page: import("@playwright/test").Page) =>
  page.locator('[aria-live="polite"]:not(output)')

test("no axe violations at first", async ({ page, open }) => {
  await open("file-input")
  await expect(browse(page)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations while dragging", async ({ page, open }) => {
  await open("file-input", { page: "" })
  await fire(zone(page), "dragenter", await transfer(page, [png]))
  await expect(zone(page)).toHaveAttribute("data-dragging", "")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with files in the list", async ({ page, open }) => {
  await open("file-input")
  await drop(zone(page), [png, { ...png, name: "b.png" }])
  await expect(list(page).getByRole("listitem")).toHaveCount(2)
  expect(await audit(page)).toEqual([])
})

test("no axe violations with the field's error showing", async ({
  page,
  open,
}) => {
  await open("file-input", { required: "" })
  await page.getByRole("button", { name: "Send" }).click()
  await expect(page.getByText(f.field.error)).toBeVisible()
  expect(await audit(page)).toEqual([])
})

test("no axe violations when disabled", async ({ page, open }) => {
  await open("file-input", { disabled: "" })
  await expect(browse(page)).toBeDisabled()
  expect(await audit(page)).toEqual([])
})

test("the zone isn't a control: the trigger inside it is the one tab stop", async ({
  page,
  open,
  tab,
}) => {
  await open("file-input")
  await page.getByRole("button", { name: "Before" }).focus()
  await tab()
  await expect(browse(page)).toBeFocused()
})

test("the accessibility tree is the same everywhere", async ({
  page,
  open,
}) => {
  await open("file-input")
  await expect(zone(page)).toMatchAriaSnapshot(`
    - group "Attachments drop zone":
      - paragraph: Drop files here
      - button "Attachments Browse files"
  `)
  await drop(zone(page), [png])
  await expect(list(page)).toMatchAriaSnapshot(`
    - list "Attached files":
      - listitem:
        - text: a.png
        - button "Remove a.png"
  `)
})

test(
  "accepted and rejected counts are announced politely",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("file-input")
    await drop(zone(page), [png, txt])
    await expect(announcer(page)).toHaveText(
      "1 file accepted. 1 file rejected."
    )
    // The same counts again are announced again.
    await drop(zone(page), [{ ...png, name: "b.png" }, txt])
    await expect(announcer(page)).toHaveText("")
    await expect(announcer(page)).toHaveText(
      "1 file accepted. 1 file rejected."
    )
  }
)

test(
  "a choice from the picker is announced too",
  { tag: "@enhancement" },
  async ({ page, open }) => {
    await open("file-input")
    const chooser = page.waitForEvent("filechooser")
    await browse(page).click()
    await (
      await chooser
    ).setFiles([
      { name: "a.png", mimeType: "image/png", buffer: Buffer.from("x") },
    ])
    await expect(announcer(page)).toHaveText("1 file accepted.")
  }
)
