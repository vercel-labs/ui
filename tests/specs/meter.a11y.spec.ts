import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "../fixtures"

async function audit(page: import("@playwright/test").Page) {
  // Page structure rules are about the fixture page, not the components.
  const results = await new AxeBuilder({ page })
    .disableRules(["region", "landmark-one-main", "page-has-heading-one"])
    .analyze()
  return results.violations.map(
    (violation) => `${violation.id}: ${violation.help}`
  )
}

test("no axe violations at rest", async ({ page, open }) => {
  await open("meter")
  expect(await audit(page)).toEqual([])
})

test("no axe violations with a value past the maximum", async ({
  page,
  open,
}) => {
  await open("meter")
  for (let step = 0; step < 3; step++) {
    await page.getByRole("button", { name: "Fill" }).click()
  }
  await expect(page.getByRole("meter", { name: "Storage" })).toHaveAttribute(
    "aria-valuenow",
    "100"
  )
  expect(await audit(page)).toEqual([])
})

// Every implementation must expose the same accessibility tree.
test("accessibility tree", async ({ page, open }) => {
  await open("meter")
  await expect(page.locator(".fixture")).toMatchAriaSnapshot(`
    - button "Before"
    - meter "Storage"
    - meter "Requests"
    - meter "Disk"
    - meter "Score"
    - button "Fill"
  `)
})

test("only a meter without a label or aria-label warns in development, whatever its value text", async ({
  page,
  open,
  framework,
}) => {
  test.skip(!framework.startsWith("web"), "Adds meters through the DOM.")
  const printed: string[] = []
  page.on(
    "console",
    (message) => message.type() === "warning" && printed.push(message.text())
  )
  await open("meter")
  await page.evaluate(() => {
    const meter = (attributes: string) =>
      `<ui-meter ${attributes} value="30"><ui-meter-value></ui-meter-value></ui-meter>`
    document
      .querySelector(".fixture")!
      .insertAdjacentHTML(
        "beforeend",
        meter('id="unnamed"') + meter('aria-label="Named"')
      )
  })
  const missing = () =>
    printed.filter((text) => text.includes("Meter has no accessible name"))
  await expect.poll(() => missing().length).toBe(1)
  expect(missing()[0]).toContain("meter#unnamed")
})
