import type { Page } from "@playwright/test"
import { expect, test } from "../fixtures"

// Only *-ssr projects render on the server first.
test.beforeEach(({ framework }) => {
  test.skip(!framework.endsWith("-ssr"), "Only for server-rendered fixtures.")
})

const hydrationErrors = (page: Page) =>
  page.evaluate(
    () =>
      (window as unknown as { __hydrationErrors: string[] }).__hydrationErrors
  )

// An attribute of the first element matching `selector` in the HTML the server sent, before hydration.
const serverAttribute = (page: Page, selector: string, name: string) =>
  page.evaluate(
    ([selector, name]) => {
      const template = document.createElement("template")
      template.innerHTML = (
        window as unknown as { __serverHtml: string }
      ).__serverHtml
      return (
        template.content.querySelector(selector)?.getAttribute(name) ?? null
      )
    },
    [selector, name]
  )

test("a combobox with a value hydrates without mismatches and shows its label", async ({
  page,
  open,
}) => {
  await open("combobox", { value: "fr" })
  await expect(page.getByRole("combobox", { name: "Country" })).toHaveValue(
    "France"
  )
  await page.getByRole("combobox", { name: "Country" }).fill("ger")
  await expect(page.getByRole("option", { name: "Germany" })).toBeVisible()
  expect(await hydrationErrors(page)).toEqual([])
})

test("chips hydrate without mismatches", async ({ page, open }) => {
  await open("combobox", { multiple: "", value: "br,fr" })
  await expect(page.locator('[data-slot="combobox-chip"]')).toHaveCount(2)
  expect(await hydrationErrors(page)).toEqual([])
})

// Without `itemToLabel`, so only the items know the label.
for (const [items, options] of [
  ["composed items", { "labels-from-items": "" }],
  ["items as data", { "labels-from-items": "", data: "" }],
] as const) {
  test(`the server markup shows the selected item's label in the input, with ${items}`, async ({
    page,
    open,
    framework,
  }) => {
    // A snippet can't be read before it renders, unlike a Vue slot or React children.
    test.skip(
      framework.startsWith("svelte") && items === "composed items",
      "Svelte roots can't read their items' labels before they mount."
    )
    // Solid has no element tree to walk before the items render, unlike React children or a Vue slot.
    test.skip(
      framework.startsWith("solid") && items === "composed items",
      "Solid roots can't read their items' labels before they mount; `items` or `itemToLabel` give the server the label."
    )
    await open("combobox", { value: "fr", ...options })
    expect(await serverAttribute(page, '[role="combobox"]', "value")).toBe(
      "France"
    )
    await expect(page.getByRole("combobox", { name: "Country" })).toHaveValue(
      "France"
    )
    expect(await hydrationErrors(page)).toEqual([])
  })
}
