import { expect, type Locator } from "@playwright/test"
import { testExamples } from "./docs-helpers"

// A part by its name. Parts are links with getHref and buttons without.
function part(
  preview: Locator,
  name: string,
  role: "button" | "link" = "button"
) {
  return preview.getByRole(role, { name, exact: true })
}

async function expectCurrent(
  preview: Locator,
  name: string,
  role?: "button" | "link"
) {
  await expect(
    part(preview, name, role),
    `page ${name} is current`
  ).toHaveAttribute("aria-current", "page")
}

// Starts on a page, presses a part, and checks the current page moved.
const goes =
  (from: string, press: string, to: string, role?: "button" | "link") =>
  async (preview: Locator) => {
    await expectCurrent(preview, from, role)
    await part(preview, press, role).click()
    await expectCurrent(preview, to, role)
  }

// The last line an example logged to the console under its preview.
function lastLog(preview: Locator) {
  return preview
    .locator("xpath=ancestor::figure[1]")
    .locator('section[aria-label="Console"] li:not([aria-hidden])')
    .last()
}

// Each example's check, in the order they appear on the Pagination page.
testExamples("pagination", {
  basic: async (preview) => {
    // Previous says it's disabled on the first page, and Next steps one page.
    await expect(part(preview, "Previous")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    await goes("1", "Next", "2")(preview)
    await expect(lastLog(preview)).toHaveText("Page 2 (next-press)")
    await expect(part(preview, "Previous")).not.toHaveAttribute(
      "aria-disabled",
      "true"
    )
  },
  total: async (preview) => {
    await expect(preview.getByText("Showing 21–40 of 95")).toBeVisible()
    await goes("2", "3", "3")(preview)
    await expect(lastLog(preview)).toHaveText("Page 3")
    await expect(preview.getByText("Showing 41–60 of 95")).toBeVisible()
    // A new page size starts again from the first page.
    await preview.getByLabel("Rows per page").selectOption("50")
    await expect(lastLog(preview)).toHaveText("50 rows per page")
    await expect(preview.getByText("Showing 1–50 of 95")).toBeVisible()
    await expectCurrent(preview, "1")
  },
  render: async (preview) => {
    await expect(part(preview, "Previous page")).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    await goes("Page 1", "Next page", "Page 2")(preview)
  },
  rtl: goes("1", "التالي", "2"),
})
